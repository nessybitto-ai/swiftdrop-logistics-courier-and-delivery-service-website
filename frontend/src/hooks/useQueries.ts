import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PackageTracking, DeliveryRequest, Testimonial, TrackingStatus, UserProfile, TrackingNumberRequest } from '../backend';

export function useGetTrackingInfo(trackingNumber: string, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<PackageTracking>({
    queryKey: ['tracking', trackingNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getTrackingInfo(trackingNumber);
    },
    enabled: !!actor && !isFetching && enabled && trackingNumber.length > 0,
    retry: false,
  });
}

export function useSubmitDeliveryRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      senderName: string;
      senderPhone: string;
      pickupAddress: string;
      receiverName: string;
      receiverPhone: string;
      deliveryAddress: string;
      parcelDescription: string;
      parcelWeight: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitDeliveryRequest(
        data.senderName,
        data.senderPhone,
        data.pickupAddress,
        data.receiverName,
        data.receiverPhone,
        data.deliveryAddress,
        data.parcelDescription,
        data.parcelWeight
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryRequests'] });
    },
  });
}

export function useGetPublicTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['publicTestimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['allTestimonials'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSubmitTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      authorName: string;
      content: string;
      rating: number;
      authorImage: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitTestimonial(
        data.authorName,
        data.content,
        data.rating,
        data.authorImage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['allTestimonials'] });
    },
  });
}

export function useUpdateTrackingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { trackingNumber: string; newStatus: TrackingStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTrackingStatus(data.trackingNumber, data.newStatus);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tracking', variables.trackingNumber] });
      queryClient.invalidateQueries({ queryKey: ['deliveryRequests'] });
    },
  });
}

export function useGenerateTrackingNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateTrackingNumberForDelivery(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryRequests'] });
    },
  });
}

export function useGetAllDeliveryRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryRequest[]>({
    queryKey: ['deliveryRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllDeliveryRequests();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateTrackingNumberRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      senderName: string;
      receiverName: string;
      parcelDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createTrackingNumberRequest(
        data.senderName,
        data.receiverName,
        data.parcelDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackingNumberRequests'] });
    },
  });
}

export function useGetAllTrackingNumberRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<TrackingNumberRequest[]>({
    queryKey: ['trackingNumberRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllTrackingNumberRequests();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
