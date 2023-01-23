import socketio, eventlet
from preprocess import SignPredict, SignToText

videos_path = "../data/videos/"
model_path = "../model/model_2022-09-25_01:17:07.pkl"
text_to_sign = SignToText(path=videos_path)
sign_predict = SignPredict(model_path)

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, static_files={
    '/':'./public/'})

@sio.event
def connect(sid, environ):
    print(f'[INFO] client connected: {sid}')
    sio.emit("send",{"from": "connect"}, to=sid)

@sio.event
def disconnect(sid):
    print(f'[INFO] client disconnected: {sid}') 

@sio.event
def stream_text(sid, data):
    """ 
        INPUT: sid, txt
        OUTPUT: emit signs frames for the recived text
    """
    for sign_frame in text_to_sign.sign_gen(data.get("data")):
        sio.emit("stream_text", {'data': sign_frame, "id":data.get("id")}, to=sid) 
    sio.emit("send",{"id": data.get("id")}, to=sid)
   
@sio.event
def stream_sign(sid, data):
    """ 
        INPUT: sid, hand landmarks frames 
        OUTPUT: emit char for the recived landmarks
    """
    pred = sign_predict.sign_predict(data.get("landmarks"))
    sio.emit("stream_sign", {"text": pred, "id": data.get("id")},to= sid)

def main():
    # run app
    eventlet.wsgi.server(eventlet.listen(('', 8080)), app)


if __name__ == '__main__':
    main()