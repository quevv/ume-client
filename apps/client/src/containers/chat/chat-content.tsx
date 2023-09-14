import { GrinningFaceWithOpenMouth, MoreOne, PhoneTelephone, Picture, Videocamera } from '@icon-park/react'
import useChatScroll from '~/hook/useChatScroll'

import { ReactNode, useContext, useEffect, useId, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { ChattingChannelReponse, MemberChatChannelResponse } from 'ume-chatting-service-openapi'

import {
  SocketClientEmit,
  SocketContext,
  SocketTokenContext,
  UserContext,
} from '~/components/layouts/app-layout/app-layout'
import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { getSocket } from '~/utils/constants'
import { trpc } from '~/utils/trpc'

interface actionButtonProps {
  actionButton: ReactNode
}

const actionButtons: actionButtonProps[] = [
  {
    actionButton: <Videocamera theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
  },
  {
    actionButton: <PhoneTelephone theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />,
  },
  { actionButton: <MoreOne theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" /> },
]
const convertArrayObjectToObject = (input: Array<any>, key: string = '_id') => {
  return input.reduce((acc, obj) => {
    acc[obj[key]] = obj
    return acc
  }, {})
}
const ChatContent = (props: { channel: ChattingChannelReponse }) => {
  const index = useId()
  const [messageInput, setMessageInput] = useState('')
  const { userContext } = useContext(UserContext)
  const { socketClientEmit } = useContext(SocketClientEmit)
  const { socketContext } = useContext(SocketContext)
  const { socketToken } = useContext(SocketTokenContext)

  const utils = trpc.useContext()
  const { data: chattingMessageChannel, isLoading: loadingChattingMessageChannel } = trpc.useQuery([
    'chatting.getMessagesByChannelId',
    { channelId: props.channel._id, limit: 'unlimited', page: '1' },
  ])
  const divRef = useRef(null)
  useChatScroll(divRef, chattingMessageChannel)

  useEffect(() => {
    if (socketContext?.socketChattingContext) {
      utils.invalidateQueries('chatting.getMessagesByChannelId')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext?.socketChattingContext, socketToken])

  const mappingMember: { [key: string]: MemberChatChannelResponse } = convertArrayObjectToObject(
    chattingMessageChannel?.data.members || [],
    'userId',
  )

  const images = chattingMessageChannel?.data.members.filter((member) => {
    return member.userId.toString() != userContext?.id.toString()
  })!

  const handleSentMessage = () => {
    if (socketToken && messageInput != '') {
      socketClientEmit?.socketInstanceChatting?.emit(getSocket().SOCKER_CHATTING_SERVER_ON.SENT_MESSAGE_TO_CHANNEL, {
        channelId: props.channel._id,
        content: messageInput,
      })
      setMessageInput('')
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSentMessage()
    }
  }

  return (
    <>
      {loadingChattingMessageChannel ? (
        <CommentSkeletonLoader />
      ) : (
        <div className="relative max-h-screen overflow-hidden">
          <div className="w-full flex items-center justify-between">
            <Link
              href={`/player/${images[0].providerInfomation.slug || images[0].providerInfomation.id}`}
              className="w-3/4 p-2 rounded-lg hover:bg-gray-700"
            >
              {images && (
                <div className="flex items-center gap-3">
                  <div className="relative min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]">
                    <Image
                      className="absolute rounded-full"
                      layout="fill"
                      objectFit="cover"
                      src={images[0].userInfomation.avatarUrl!}
                      alt="Avatar"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white truncate">{images[0].userInfomation.name || ''}</span>
                </div>
              )}
            </Link>
            <div className="flex gap-2">
              {actionButtons.map((item) => (
                <div
                  key={index}
                  className="p-2 bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400"
                >
                  {item.actionButton}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            <div className="flex gap-2 pb-5 overflow-auto border-b-2 border-[#B9B8CC] custom-scrollbar">
              {/* {props.data?.providerSkills?.map((providerSkill, index) => (
            <div
              key={index}
              className={`px-5 text-center rounded-2xl border-2 cursor-pointer ${gameSelected === index ? 'bg-purple-600 border-indigo-900' : 'bg-[#413F4D]'
                }`}
              onClick={() => setGameSelected(index)}
            >
              <p className="text-lg font-medium text-white whitespace-nowrap">{providerSkill.skill.name}</p>
            </div>
            ))} */}
            </div>
            <div className="bg-[#413F4D] p-2 rounded-3xl">
              {/* <ChatService serviceData={props.data?.providerSkills[gameSelected]} /> */}
            </div>
          </div>
          <div className="relative">
            <div className="h-[75vh] flex flex-col justify-end">
              {/* <!-- message --> */}
              <div
                ref={divRef}
                className="flex flex-col w-full px-5 mb-12 overflow-y-scroll custom-scrollbar justinfy-between"
              >
                <div className="flex flex-col mt-5 ">
                  {chattingMessageChannel?.data.messages.map((item, index) => {
                    const sender = mappingMember[item.senderId]
                    const isSeftMessage = sender.userId.toString() == userContext?.id.toString()
                    return (
                      <div key={index} className={`flex justify-end  ${!isSeftMessage ? 'flex-row-reverse' : ''} mb-4`}>
                        <div
                          className={`max-w-xs mx-2 py-3 px-4 text-white text-lg
                        ${
                          isSeftMessage
                            ? ' bg-blue-500  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
                            : 'bg-gray-700 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                        }
                       whitespace-pre-wrap
                       break-words`}
                        >
                          <span>{item.content}</span>
                        </div>

                        <div className="relative w-8 h-8 ">
                          <Image
                            className="rounded-full"
                            layout="fill"
                            objectFit="cover"
                            height={600}
                            width={600}
                            src={sender.userInfomation.avatarUrl}
                            alt="Avatar"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* <!-- end message --> */}
            </div>
            <div className="absolute bottom-2 left-5 right-5  bg-[#15151b] flex items-center gap-3">
              <div className="p-2 content-center bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
                <Picture theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>

              <div className="w-[100%] h-[40px] relative">
                <input
                  type="text"
                  className="h-[40px] w-full bg-[#413F4D] text-white text-lg font-medium pl-5 pr-10 rounded-full"
                  placeholder="Nhập tin nhắn"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="absolute transform -translate-y-1/2 rounded-full cursor-pointer top-1/2 right-3 z-4 hover:bg-gray-500 active:bg-gray-400">
                  <GrinningFaceWithOpenMouth theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ChatContent
