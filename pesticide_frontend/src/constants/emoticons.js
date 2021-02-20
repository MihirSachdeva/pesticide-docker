const emoticons = [
  { aria_label: "thumbs_up", emoji: "👍" },
  { aria_label: "thumbs_down", emoji: "👎" },
  { aria_label: "correct", emoji: "✅" },
  { aria_label: "wrong", emoji: "❌" },
  { aria_label: "happy_face", emoji: "😀" },
  { aria_label: "laughing_face", emoji: "😂" },
  { aria_label: "wink_face", emoji: "😉" },
  { aria_label: "face_with_sunglasses", emoji: "😎" },
  { aria_label: "sad_face", emoji: "😔" },
  { aria_label: "crying_face", emoji: "😭" },
  { aria_label: "angry_face", emoji: "😠" },
  { aria_label: "sweat_face", emoji: "😅" },
  { aria_label: "hugging_face", emoji: "🤗" },
  { aria_label: "brain_exploding_face", emoji: "🤯" },
  { aria_label: "love", emoji: "❤️" },
  { aria_label: "eyes", emoji: "👀" },
  { aria_label: "hooray", emoji: "🎉" },
  { aria_label: "fire", emoji: "🔥" },
  { aria_label: "rocket", emoji: "🚀" },
  { aria_label: "brain", emoji: "🧠" },
  { aria_label: "sparkles", emoji: "✨" },
  { aria_label: "hundred", emoji: "💯" },
  { aria_label: "fingers_crossed", emoji: "🤞" },
  { aria_label: "question_mark", emoji: "❓" },
  { aria_label: "poop", emoji: "💩" },
  { aria_label: "clown", emoji: "🤡" },
]

export const getEmoji = (aria_label) => {
  const emoticon = emoticons.find(emoticon => emoticon.aria_label === aria_label) || { emoji: "❓" }
  return (emoticon.emoji)
}

export default emoticons