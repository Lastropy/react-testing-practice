// This file setups a server to handle request using the handlers specified
import {setupServer} from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);