import PubSub from 'pubsub-js'
import { useState } from 'react'

function Publish() {
  const [title, setTitle] = useState()
  const token = PubSub.subscribe('func1', function (msg, data) {
    setTitle(data + '1')
  })
  return <div>{title}</div>
}

export default Publish
