import { AppConfig } from '../models/appconfig';
import { readFileSync } from 'fs';

export const config = JSON.parse(readFileSync('config.json', 'UTF-8')) as AppConfig;