import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Define old actor type with minimal fields and empty records
  type OldActor = {
    deliveryRequests : Map.Map<Nat, {}>;
    packageTrackings : Map.Map<Text, {}>;
    requestIdCounter : Nat;
  };

  // Define tracking number request type
  type TrackingNumberRequest = {
    requestId : Nat;
    senderName : Text;
    receiverName : Text;
    parcelDescription : Text;
    createdAt : Int;
  };

  // Define new actor type with tracking number requests and counter
  type NewActor = {
    deliveryRequests : Map.Map<Nat, {}>;
    packageTrackings : Map.Map<Text, {}>;
    requestIdCounter : Nat;
    trackingNumberRequests : Map.Map<Nat, TrackingNumberRequest>;
    trackingRequestIdCounter : Nat;
  };

  // Migration function adds empty trackingNumberRequests map and initializes counter
  public func run(old : OldActor) : NewActor {
    {
      old with
      trackingNumberRequests = Map.empty<Nat, TrackingNumberRequest>();
      trackingRequestIdCounter = 0;
    };
  };
};
