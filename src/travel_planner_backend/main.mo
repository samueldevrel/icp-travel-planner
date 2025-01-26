import Text "mo:base/Text";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
actor {
  type User={
    id:Principal;
    history:[History];
  };

  type History={
    id:Text;
    request:Text;
    response:Text;
  };

  let usersdata=HashMap.HashMap<Principal,User>(0,Principal.equal,Principal.hash);
  let hist=HashMap.HashMap<Text,History>(1,Text.equal,Text.hash);
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
public shared ({caller}) func registeruser():async Text{


  switch(usersdata.get(caller)){

    case (null){
      let new_user:User={
        id=caller;
        history=[];
      };
        usersdata.put(caller,new_user);
      return "welcome"
    };
    case(?_found){
      return "welcome back"
    };
  };

};
//user history

     public query func getAllHistory():async [User]{
     
    
      return Iter.toArray(usersdata.vals());
     };

//enter serach results
public shared ({caller}) func enter_user_search(request:Text,response:Text):async Result.Result<Text,Text>{

      let id:Text=Int.toText(Time.now());

     
    let new_search:History={
        id;
        response;
        request;

      };
  switch(usersdata.get(caller)){

    case(null){
      return #err("failed")
    };
    case(?his){

      //update users history
      let historybuffer=Buffer.fromArray<History>(his.history);

      historybuffer.add(new_search);

      let updatedhistory=Buffer.toArray(historybuffer);

      let updateduser:User={
        id=caller;
        history=updatedhistory;
      };
     usersdata.put(caller,updateduser);
      return #ok(response)
    }
  }
};
//clear all history

public shared ({caller}) func clear_history():async Text{

  switch(usersdata.get(caller)){
    case (null){
      return "failed"
    };
    case(?_found){

      let newupdateduser:User={
        id=caller;
        history=[];
      };
     usersdata.put(caller,newupdateduser);
      return "cleared"
    }
  }

}
};

//create user array
//add response request
//clear history