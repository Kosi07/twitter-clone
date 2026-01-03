
import { tweetType } from "@/lib/types"
import Tweet from "./Tweet"


const Comments = ({comments}:
    {comments: tweetType[]}
) => {

  return (
    <div>
        {comments.map((comment)=>
            <Tweet key={comment.handle+''+`${comment.createdAt}`} id={`${comment._id}`} username={comment.username} handle={comment.handle} profilePic={comment.profilePic} createdAt={comment.createdAt} tweetText={comment.tweetText} commentCounter={comment.commentCounter} likeCounter={comment.likeCounter} imgSrc={comment.imgSrc} />)
        }
    </div>
  )
}

export default Comments