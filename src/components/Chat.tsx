import { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useStore } from "../store";
import {v4 as uuid} from "uuid"

function Chat({

}) {
  const selectedVideo = useStore(state => state.selectedVideo)
  const fetchFunction = useStore(state => state.fetchFunction)
  const updateChatResponse = useStore(state => state.updateChatResponse)
  const appendChat = useStore(state => state.appendChat)
  const inputRef = useRef(null)
  
  async function sendChat(chatId: string) {
    appendChat(selectedVideo.id, chatId, inputRef.current.value)
    const send = await fetchFunction(
      `/videos/${selectedVideo.id}?prompt=${inputRef.current.value}&id=${chatId}`,
      null,
      "get",
      true
    )
    updateChatResponse(selectedVideo.id, chatId, send.data.response)
  }
  
  if (!selectedVideo || !selectedVideo.summary ) return <></>
  return (
    <aside className="text-[white] sidebars poppins relative right-0 z-[10] bg-[#32363b]  shadow-2xl">
      <header className="px-3  py-4" style={{borderBottom: "1px solid gray"}}>
        <h1 className="text-[.85rem] " > {selectedVideo.name} </h1>
      </header>

      <div className="px-3 py-2 w-full" style={{overflowY: "scroll"}}>
        {
          selectedVideo && selectedVideo.chats.map(chat => {
            return (
              <div className="mb-3 text-[.7rem]">
                <div className={`bg-[#414c59] px-2 mb-2 py-2 min-w-[auto] rounded-md max-w-[90%]`}>
                  <span className="">{chat.prompt}</span>
                </div>
                <div className={`bg-[#414c59] float-right px-2 py-2 min-w-[auto] rounded-md max-w-[90%]`}>
                  <span className="">{chat.response}</span>
                </div>
              </div>
            )
          })
        }
        
      </div>
      
      <div className="absolute bg-[#414c59] bottom-0 pr-2 h-[50px] flex w-full items-center bg-[#414c59]">
        <input type="text" className="text-[.7rem] flex-1 border-0 bg-[transparent] pl-2 py-1 rounded-md h-full outline-0 " placeholder="Type here to search" />
        <IoSendSharp className="text-[1.5rem]"
          onClick={() => {
            sendChat(uuid())
          }}
         />
      </div>
    </aside>
  );
}

export default Chat;
