import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { Event } from "../types";
import { toast } from "sonner";

export function useEvents() {
  const queryClient = useQueryClient();

  const getEventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getEvents(),
    staleTime: 5 * 60 * 1000
  });

  const addEventMutation = useMutation({
    mutationFn: (data: Omit<Event, "id">) => eventService.createEvent(data),
    onSuccess: (newEvent) => {
      toast.success("Event Scheduled", {
        description: `"${newEvent.title}" has been added to operational schedules.`
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      toast.error("Booking Failed", {
        description: err.message
      });
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) =>
      eventService.updateEvent(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);

      if (previousEvents) {
        queryClient.setQueryData<Event[]>(
          ["events"],
          previousEvents.map((evt) => (evt.id === id ? { ...evt, ...data } as Event : evt))
        );
      }

      return { previousEvents };
    },
    onError: (err, variables, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents);
      }
      toast.error("Update Failed", {
        description: err.message
      });
    },
    onSuccess: (updated) => {
      toast.success("Event Updated", {
        description: `"${updated.title}" settings have been resolved.`
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);

      if (previousEvents) {
        queryClient.setQueryData<Event[]>(
          ["events"],
          previousEvents.filter((e) => e.id !== id)
        );
      }

      return { previousEvents };
    },
    onError: (err, id, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents);
      }
      toast.error("Deletion Failed", {
        description: err.message
      });
    },
    onSuccess: () => {
      toast.info("Event Cancelled", {
        description: "Event schedule was successfully deleted."
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });

  return {
    events: getEventsQuery.data ?? [],
    isLoading: getEventsQuery.isLoading,
    isError: getEventsQuery.isError,
    addEvent: addEventMutation.mutate,
    isAdding: addEventMutation.isPending,
    updateEvent: updateEventMutation.mutate,
    isUpdating: updateEventMutation.isPending,
    deleteEvent: deleteEventMutation.mutate,
    isDeleting: deleteEventMutation.isPending
  };
}
