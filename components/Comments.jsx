
import Tweet from "./Tweet"


const Comments = ({comments}) => {

  return (
    <>
        {comments.map((comment)=>
            <Tweet key={`${comment._id}`} id={`${comment._id}`} username={comment.username} handle={comment.handle} profilePic={comment.profilePic} createdAt={comment.createdAt} tweetText={comment.tweetText} commentCounter={comment.commentCounter} likeCounter={comment.likeCounter} imgSrc={comment.imgSrc} />)
        }
    </>
  )
}

export default Comments