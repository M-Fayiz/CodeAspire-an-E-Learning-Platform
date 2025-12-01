export interface VideoListenEvents {
  "video:join": (payload: { roomId: string }) => void;
  "video:offer": (payload: {
    roomId: string;
    sdp: RTCSessionDescriptionInit;
  }) => void;
  "video:answer": (payload: {
    roomId: string;
    sdp: RTCSessionDescriptionInit;
  }) => void;
  "video:ice-candidate": (payload: {
    roomId: string;
    candidate: RTCIceCandidateInit;
  }) => void;
  "video:leave": (payload: { roomId: string }) => void;
}

export interface VideoEmitEvents {
  "video:peer-joined": (payload: { userId: string }) => void;
  "video:offer": (payload: {
    sdp: RTCSessionDescriptionInit;
    from: string;
  }) => void;
  "video:answer": (payload: {
    sdp: RTCSessionDescriptionInit;
    from: string;
  }) => void;
  "video:ice-candidate": (payload: { candidate: any; from: string }) => void;
  "video:peer-left": (payload: { userId: string }) => void;
  "video:force-leave": (data: { reason: string }) => void;
}
