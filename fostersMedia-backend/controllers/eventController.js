import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../services/eventService.js';

export const createEventHandler = async (req, res, next) => {
  try {
    const event = await createEvent(req.body);
    successResponse(res, 'Event created successfully', event, 201);
  } catch (error) {
    next(error);
  }
};

export const getEventsHandler = async (req, res, next) => {
  try {
    const result = await getEvents(req.query);
    paginateResponse(res, 'Events fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getEventByIdHandler = async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id);
    successResponse(res, 'Event fetched successfully', event);
  } catch (error) {
    next(error);
  }
};

export const updateEventHandler = async (req, res, next) => {
  try {
    const event = await updateEvent(req.params.id, req.body);
    successResponse(res, 'Event updated successfully', event);
  } catch (error) {
    next(error);
  }
};

export const deleteEventHandler = async (req, res, next) => {
  try {
    await deleteEvent(req.params.id);
    successResponse(res, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};
