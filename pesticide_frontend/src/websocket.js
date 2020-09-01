import * as api_links from "./APILinks";

class WebsocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebsocketService.instance) {
      WebsocketService.instance = new WebsocketService();
    }
    return WebsocketService.instance;
  }

  constructor() {
    this.sockRef = null;
  }

  connect(issue_id) {
    const path = api_links.WEBSOCKET_ROOT + `issue_comments/${issue_id}/`;
    this.sockRef = new WebSocket(path);
    this.sockRef.onopen = () => {
      console.log("Websocket open.");
    };
    this.socketNewComment(
      JSON.stringify({
        command: "fetch_comments",
      })
    );
    this.sockRef.onmessage = (e) => {
      this.socketNewComment(e.data);
    };
    this.sockRef.onerror = (e) => {
      console.log(e);
    };
    this.sockRef.onclose = () => {
      console.log("Websocket closed.");
    };
  }

  disconnect() {
    this.sockRef.close();
  }

  socketNewComment(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "comments") {
      this.callbacks[command](parsedData.comments);
    }
    if (command === "new_comment") {
      this.callbacks[command](parsedData.comment);
    }
    if (command === "delete_comment") {
      this.callbacks[command](parsedData.comment_id);
    }
  }

  fetchComments(issue) {
    this.sendMessage({
      command: "fetch_comments",
      issue: issue,
    });
  }

  newChatComment(comment) {
    this.sendMessage({
      command: "new_comment",
      commentor: comment.commentor,
      text: comment.text,
      issue: comment.issue,
    });
  }

  deleteComment(comment) {
    this.sendMessage({
      command: "delete_comment",
      comment_id: comment,
    });
  }

  addCallbacks(commentsCallback, newCommentCallback, deleteCommentCallback) {
    this.callbacks["comments"] = commentsCallback;
    this.callbacks["new_comment"] = newCommentCallback;
    this.callbacks["delete_comment"] = deleteCommentCallback;
  }

  sendMessage(data) {
    try {
      this.sockRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.sockRef.readyState;
  }
}

const WebSocketInstance = WebsocketService.getInstance();

export default WebSocketInstance;
