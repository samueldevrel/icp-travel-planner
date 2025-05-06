import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Principal "mo:base/Principal";

actor {

  //helpers functions

  private func generateId() : Text {
    let timestamp = Int.toText(Time.now());
    "USER-" # timestamp;
  };

  private func generateTimestamp() : Text {
    Int.toText(Time.now());
  };

  // Type definitions

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
  };

  public type User = {
    id : Principal;
    history : [History];
  };

  public type History = {
    id : Text;
    request : Text;
    response : Text;
    createdAt : Text;
  };

//storages

  private let usersdata = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
  private let hist = HashMap.HashMap<Text, History>(1, Text.equal, Text.hash);

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public shared ({ caller }) func whaomai() : async Principal {
    return caller;
  };

  public shared ({ caller }) func registeruser() : async Text {

    switch (usersdata.get(caller)) {

      case (null) {
        let new_user : User = {
          id = caller;
          history = [];
        };
        usersdata.put(caller, new_user);
        return "welcome";
      };
      case (?_found) {
        return "welcome back";
      };
    };

  };

  //user history

  public query func getAllHistory() : async [User] {

    return Iter.toArray(usersdata.vals());
  };

  //enter serach results
  public shared ({ caller }) func enter_user_search(request : Text, response : Text) : async Result.Result<Text, Text> {

    let id : Text = Int.toText(Time.now());

    let new_search : History = {
      id;
      response;
      request;
      createdAt = generateTimestamp();

    };
    switch (usersdata.get(caller)) {

      case (null) {
        return #err("failed");
      };
      case (?his) {

        //update users history
        let historybuffer = Buffer.fromArray<History>(his.history);

        historybuffer.add(new_search);

        let updatedhistory = Buffer.toArray(historybuffer);

        let updateduser : User = {
          id = caller;
          history = updatedhistory;
        };
        usersdata.put(caller, updateduser);
        hist.put(request, new_search);
        return #ok(response);
      };
    };
  };

  //get specific user search response
  public query func get_search(request : Text) : async Result.Result<History, Text> {

    switch (hist.get(request)) {
      case (null) {
        return #err("not found");
      };
      case (?found) {
        return #ok(found);
      };
    };
  };

  //clear all history

  public shared ({ caller }) func clear_history() : async Text {

    switch (usersdata.get(caller)) {
      case (null) {
        return "failed";
      };
      case (?_found) {

        let newupdateduser : User = {
          id = caller;
          history = [];
        };
        usersdata.put(caller, newupdateduser);
        return "cleared";
      };
    }

  };
};
