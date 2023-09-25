import { ArrowLeft, Dot } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import cover from 'public/cover.png'
import Chat from '~/containers/chat/chat.container'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useContext, useEffect, useRef, useState } from 'react'

import Image, { StaticImageData } from 'next/legacy/image'

import { LoginModal } from '../header/login-modal.component'
import { DrawerContext, SocketContext } from '../layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

interface chatProps {
  imgSrc: string | StaticImageData
  name: string
  message?: {
    player?: { context: any; time: Date }[]
    me?: { context: any; time: Date }[]
  }
}

export const Sidebar = (props) => {
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)

  const { isAuthenticated, user } = useAuth()
  const { socketContext, setSocketContext } = useContext(SocketContext)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const utils = trpc.useContext()
  const { data: chattingChannels } = trpc.useQuery(['chatting.getListChattingChannels', { limit: '5', page: '1' }], {
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (isAuthenticated) {
      setIsModalLoginVisible(false)
    }
  }, [isAuthenticated])

  const handleChatOpen = (channelId?: string) => {
    if (isAuthenticated) {
      setChildrenDrawer(<Chat providerId={channelId} />)
      if (channelId) {
        setSocketContext((prevState) => ({
          ...prevState,
          socketContext: {
            ...prevState,
            socketChattingContext: [],
          },
        }))
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  useEffect(() => {
    if (socketContext.socketChattingContext) {
      utils.invalidateQueries('chatting.getListChattingChannels')
      setShowMessage(true)
      const timeout = setTimeout(() => {
        setShowMessage(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext?.socketChattingContext, socketContext?.socketChattingContext[0]?.channelId, isAuthenticated])

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 px-4 pt-10">
        <CustomDrawer
          customOpenBtn={`p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400`}
          openBtn={
            <div onClick={() => handleChatOpen()}>
              <ArrowLeft theme="outline" size="30" fill="#fff" />
            </div>
          }
          token={isAuthenticated}
        >
          {childrenDrawer}
        </CustomDrawer>
        <div className="flex flex-col gap-3">
          {isAuthenticated &&
            chattingChannels?.data.row.map((item) => {
              const images = item.members.filter((member) => {
                return member.userId.toString() != user?.id.toString()
              })
              return (
                <div key={item._id} className="relative">
                  <CustomDrawer
                    openBtn={
                      <div>
                        {item._id === socketContext?.socketChattingContext[0]?.channelId &&
                        socketContext?.socketChattingContext[0]?.senderId !== user?.id ? (
                          <>
                            <div className="relative">
                              <Dot
                                className="absolute top-0 left-0 z-10"
                                theme="filled"
                                size="20"
                                fill="#FF0000"
                                strokeLinejoin="bevel"
                              />
                            </div>
                            {showMessage && (
                              <div className="max-w-xs absolute top-2 bottom-2 right-[60px] p-2 bg-purple-700 rounded-lg text-white">
                                <p className="truncate">{socketContext?.socketChattingContext[0]?.content}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        <div className={`relative w-14 h-14`}>
                          <Image
                            className="absolute rounded-full"
                            layout="fill"
                            objectFit="cover"
                            key={item._id}
                            src={images[0].userInformation.avatarUrl}
                            alt="avatar"
                            onClick={() => handleChatOpen(item._id)}
                          />
                        </div>
                      </div>
                    }
                  >
                    {childrenDrawer}
                  </CustomDrawer>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}
