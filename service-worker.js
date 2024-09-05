//I am creating my first service worker
//service workers are necessary for mobile app development because they intercept and cache network requests
//this is necessary for offline functionality

const CACHE_NAME = 'Cultivation'; //The name of the cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/Algae192.png',
  '/Sun512.png'
]; //This is the list of files that have to be cached