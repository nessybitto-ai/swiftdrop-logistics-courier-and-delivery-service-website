import AccessControl "authorization/access-control";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();

  // Admin-only: Initialize first admin
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  // User functions
  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type TrackingStatus = {
    #accepted;
    #inTransit;
    #arrivedAtFacility;
    #outForDelivery;
    #delivered;
  };

  public type PackageTracking = {
    trackingNumber : Text;
    senderName : Text;
    receiverName : Text;
    currentStatus : TrackingStatus;
    statusHistory : [(TrackingStatus, Int)];
    createdAt : Int;
  };

  public type DeliveryRequest = {
    requestId : Nat;
    senderName : Text;
    senderPhone : Text;
    pickupAddress : Text;
    receiverName : Text;
    receiverPhone : Text;
    deliveryAddress : Text;
    parcelDescription : Text;
    parcelWeight : Text;
    trackingNumber : Text;
    createdAt : Int;
  };

  public type Testimonial = {
    authorName : Text;
    content : Text;
    rating : Nat8;
    authorImage : Text;
    createdAt : Int;
  };

  public type TrackingNumberRequest = {
    requestId : Nat;
    senderName : Text;
    receiverName : Text;
    parcelDescription : Text;
    createdAt : Int;
  };

  let trackingNumberRequests = Map.empty<Nat, TrackingNumberRequest>(); // Initialize tracking number requests map
  let deliveryRequests = Map.empty<Nat, DeliveryRequest>();
  let testimonials = List.empty<Testimonial>();
  let packageTrackings = Map.empty<Text, PackageTracking>();

  var requestIdCounter = 0;
  var trackingRequestIdCounter = 0; // Separate counter for tracking number requests
  let THIRTY_DAYS : Int = 30 * 24 * 60 * 60 * 1000000000;

  module DeliveryRequest {
    public func compareByCreatedAt(a : DeliveryRequest, b : DeliveryRequest) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  module Testimonial {
    public func compareByCreatedAt(a : Testimonial, b : Testimonial) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  module TrackingNumberRequest {
    public func compareByCreatedAt(a : TrackingNumberRequest, b : TrackingNumberRequest) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  // Delivery request submission - accessible to all users including guests
  public shared ({ caller }) func submitDeliveryRequest(
    senderName : Text,
    senderPhone : Text,
    pickupAddress : Text,
    receiverName : Text,
    receiverPhone : Text,
    deliveryAddress : Text,
    parcelDescription : Text,
    parcelWeight : Text,
  ) : async Text {
    let trackingNumber = generateTrackingNumber();
    let now = Time.now();

    let newRequest : DeliveryRequest = {
      requestId = requestIdCounter;
      senderName;
      senderPhone;
      pickupAddress;
      receiverName;
      receiverPhone;
      deliveryAddress;
      parcelDescription;
      parcelWeight;
      trackingNumber;
      createdAt = now;
    };

    deliveryRequests.add(requestIdCounter, newRequest);

    let initialTracking : PackageTracking = {
      trackingNumber;
      senderName = newRequest.senderName;
      receiverName = newRequest.receiverName;
      currentStatus = #accepted;
      statusHistory = [(#accepted, Time.now())];
      createdAt = now;
    };

    packageTrackings.add(trackingNumber, initialTracking);

    requestIdCounter += 1;
    trackingNumber;
  };

  // Admin-only: Create tracking number request
  public shared ({ caller }) func createTrackingNumberRequest(senderName : Text, receiverName : Text, parcelDescription : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tracking number requests");
    };

    let newRequest : TrackingNumberRequest = {
      requestId = trackingRequestIdCounter;
      senderName;
      receiverName;
      parcelDescription;
      createdAt = Time.now();
    };

    trackingNumberRequests.add(trackingRequestIdCounter, newRequest);
    trackingRequestIdCounter += 1;
  };

  // Admin-only: Get all tracking number requests
  public query ({ caller }) func getAllTrackingNumberRequests() : async [TrackingNumberRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view tracking number requests");
    };

    let requestsArray = trackingNumberRequests.values().toArray();
    requestsArray.sort(TrackingNumberRequest.compareByCreatedAt);
  };

  // Update package tracking status (admin-only)
  public shared ({ caller }) func updateTrackingStatus(trackingNumber : Text, newStatus : TrackingStatus) : async () {
    ensureAdminAccess(caller);

    switch (packageTrackings.get(trackingNumber)) {
      case (null) { Runtime.trap("Package not found") };
      case (?existingTracking) {
        let updatedTracking : PackageTracking = {
          trackingNumber = existingTracking.trackingNumber;
          senderName = existingTracking.senderName;
          receiverName = existingTracking.receiverName;
          currentStatus = newStatus;
          statusHistory = existingTracking.statusHistory.concat([(newStatus, Time.now())]);
          createdAt = existingTracking.createdAt;
        };
        packageTrackings.add(trackingNumber, updatedTracking);
      };
    };
  };

  // Tracking Info - accessible to all users including guests
  public query func getTrackingInfo(trackingNumber : Text) : async PackageTracking {
    switch (packageTrackings.get(trackingNumber)) {
      case (null) { Runtime.trap("Package not found") };
      case (?tracking) { tracking };
    };
  };

  // Testimonial Submission - requires user authentication to prevent spam
  public shared ({ caller }) func submitTestimonial(authorName : Text, content : Text, rating : Nat8, authorImage : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit testimonials");
    };

    let newTestimonial : Testimonial = {
      authorName;
      content;
      rating;
      authorImage;
      createdAt = Time.now();
    };
    testimonials.add(newTestimonial);
  };

  // Get all testimonials - admin-only for dashboard management
  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    ensureAdminAccess(caller);
    testimonials.toArray().sort(Testimonial.compareByCreatedAt);
  };

  // Get public testimonials - accessible to all users for display on website
  public query func getPublicTestimonials() : async [Testimonial] {
    testimonials.toArray().sort(Testimonial.compareByCreatedAt);
  };

  // Cleanup old delivered packages - admin-only maintenance operation
  public shared ({ caller }) func cleanupOldDeliveredPackages() : async () {
    ensureAdminAccess(caller);
    let now = Time.now();

    let allTrackings = packageTrackings.toArray();
    for ((trackingNumber, tracking) in allTrackings.values()) {
      if (tracking.currentStatus == #delivered and (now - tracking.createdAt) > THIRTY_DAYS) {
        packageTrackings.remove(trackingNumber);
      };
    };
  };

  // Helper function
  func generateTrackingNumber() : Text {
    "SD-" # Time.now().toText();
  };

  // Admin - Get all delivery requests (admin-only)
  public query ({ caller }) func getAllDeliveryRequests() : async [DeliveryRequest] {
    ensureAdminAccess(caller);
    deliveryRequests.values().toArray().sort(DeliveryRequest.compareByCreatedAt);
  };

  // Admin helper function to check permissions
  func ensureAdminAccess(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  public shared ({ caller }) func generateTrackingNumberForDelivery(requestId : Nat) : async Text {
    ensureAdminAccess(caller);

    switch (deliveryRequests.get(requestId)) {
      case (null) { Runtime.trap("Delivery request not found") };
      case (?request) {
        let trackingNumber = "SD-" # Time.now().toText();

        let initialTracking : PackageTracking = {
          trackingNumber;
          senderName = request.senderName;
          receiverName = request.receiverName;
          currentStatus = #accepted;
          statusHistory = [(#accepted, Time.now())];
          createdAt = Time.now();
        };

        packageTrackings.add(trackingNumber, initialTracking);

        let updatedRequest : DeliveryRequest = {
          request with
          trackingNumber
        };
        deliveryRequests.add(requestId, updatedRequest);

        trackingNumber;
      };
    };
  };
};
