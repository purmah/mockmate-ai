"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";


enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, feedbackId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<string>("");

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    }
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    }

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };

  }, []);


 useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
 
//  const handleGenerateFeedback = async(messages: SavedMessage[]) => {
//   console.log('Generate feedback here.', { messages, interviewId, userId, feedbackId });
  
//   try {
//     const { success, feedbackId: id } = await createFeedback({
//       interviewId: interviewId!,
//       userId: userId!,
//       transcript: messages,
//       feedbackId,
//     });

//     console.log('Feedback result:', { success, id });

//     if(success && id) {
//       router.push(`/interview/${interviewId}/feedback`)
//     } else {
//       console.log('Error saving feedback - success was false or no id returned');
//       router.push('/')
//     }
//   } catch (error) {
//     console.error('Error in handleGenerateFeedback:', error);
//     router.push('/');
//   }
// }

const handleGenerateFeedback = async(messages: SavedMessage[]) => {
  console.log('=== FEEDBACK GENERATION DEBUG ===');
  console.log('Messages length:', messages.length);
  console.log('Messages content:', messages);
  console.log('Interview ID:', interviewId);
  console.log('User ID:', userId);
  console.log('Feedback ID:', feedbackId);
  
  if (!interviewId || !userId) {
    console.error('Missing required parameters:', { interviewId, userId });
    router.push('/');
    return;
  }

  if (messages.length === 0) {
    console.error('No messages to process for feedback');
    router.push('/');
    return;
  }
  
  try {
    console.log('Calling createFeedback...');
    const result = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
      feedbackId,
    });

    console.log('Feedback result:', result);

    // Fix: Check for result.feedbackId instead of result.id
    if (result.success && result.feedbackId) {
      console.log('Success! Redirecting to feedback page with ID:', result.feedbackId);
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.error('Feedback creation failed:', result);
      console.error('Success:', result.success);
      console.error('FeedbackId:', result.feedbackId);
      console.error('Error details:', result.error);
      router.push('/');
    }
  } catch (error) {
    console.error('Error in handleGenerateFeedback:', error);
    router.push('/');
  }
}

    

    if(callStatus === CallStatus.FINISHED) {
      if(type === 'generate') {
        router.push('/')
      } else {
        handleGenerateFeedback(messages)
      }
    }
      
  }, [messages, callStatus, type, userId])

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, { //used to be interviewId
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async() => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }


  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage} //was latestMessage
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span>
              {isCallInactiveOrFinished
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
