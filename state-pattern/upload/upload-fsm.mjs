import fs from 'fs'
import FSM from 'javascript-state-machine'
import StateMachineHistory from 'javascript-state-machine/lib/history'
import visualize from 'javascript-state-machine/lib/visualize'

const uploadFSM = new FSM({
  init: 'waiting',
  transitions: [
    { name: 'start', from: 'waiting', to: 'uploading' },
    { name: 'start', from: 'pause', to: 'uploading' },
    { name: 'pause', from: 'uploading', to: 'pause' },
    { name: 'delete', from: 'pause', to: 'waiting' },
    { name: 'delete', from: 'fail', to: 'waiting' },
    { name: 'delete', from: 'done', to: 'waiting' },
    { name: 'upload', from: 'uploading', to: 'done' },
    { name: 'upload', from: 'uploading', to: 'fail' }
  ],
  methods: {
    onUpload: function () { console.log('上传完毕') },
    onBeforeStart: function () {console.log('start之前check')}
  },
  plugins: [
      new StateMachineHistory()    //  <-- plugin enabled here
    ]
})

console.log('state:', uploadFSM.state)
uploadFSM.start()
console.log('state:', uploadFSM.state)
console.log('uploadFSM.is uploading ?', uploadFSM.is('uploading'))
console.log('allStates:', uploadFSM.allStates())
console.log('transitions:', uploadFSM.transitions())
uploadFSM.pause()
console.log('history:', uploadFSM.history)
const r = visualize(uploadFSM)
fs.writeFile('graph.dot', r, err => {
  if (err) throw err
})
