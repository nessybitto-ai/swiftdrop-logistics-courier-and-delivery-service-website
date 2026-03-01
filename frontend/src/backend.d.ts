import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TrackingNumberRequest {
    requestId: bigint;
    createdAt: bigint;
    receiverName: string;
    senderName: string;
    parcelDescription: string;
}
export interface PackageTracking {
    trackingNumber: string;
    createdAt: bigint;
    statusHistory: Array<[TrackingStatus, bigint]>;
    receiverName: string;
    senderName: string;
    currentStatus: TrackingStatus;
}
export interface DeliveryRequest {
    deliveryAddress: string;
    senderPhone: string;
    trackingNumber: string;
    requestId: bigint;
    parcelWeight: string;
    createdAt: bigint;
    pickupAddress: string;
    receiverName: string;
    senderName: string;
    receiverPhone: string;
    parcelDescription: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Testimonial {
    content: string;
    createdAt: bigint;
    authorName: string;
    authorImage: string;
    rating: number;
}
export enum TrackingStatus {
    arrivedAtFacility = "arrivedAtFacility",
    outForDelivery = "outForDelivery",
    inTransit = "inTransit",
    delivered = "delivered",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cleanupOldDeliveredPackages(): Promise<void>;
    createTrackingNumberRequest(senderName: string, receiverName: string, parcelDescription: string): Promise<void>;
    generateTrackingNumberForDelivery(requestId: bigint): Promise<string>;
    getAllDeliveryRequests(): Promise<Array<DeliveryRequest>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getAllTrackingNumberRequests(): Promise<Array<TrackingNumberRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublicTestimonials(): Promise<Array<Testimonial>>;
    getTrackingInfo(trackingNumber: string): Promise<PackageTracking>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDeliveryRequest(senderName: string, senderPhone: string, pickupAddress: string, receiverName: string, receiverPhone: string, deliveryAddress: string, parcelDescription: string, parcelWeight: string): Promise<string>;
    submitTestimonial(authorName: string, content: string, rating: number, authorImage: string): Promise<void>;
    updateTrackingStatus(trackingNumber: string, newStatus: TrackingStatus): Promise<void>;
}
