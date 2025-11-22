#!/usr/bin/env node

const TIMEOUT_MS = 10000; // 10 second timeout

async function getTimezone() {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch('https://ipinfo.io/json', { 
            signal: controller.signal 
        });

        clearTimeout(timeoutId);

        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format. Expected JSON.');
        }

        const data = await response.json();

        // Validate response data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response data received.');
        }

        // Check if timezone field exists
        if (!data.timezone) {
            throw new Error('Timezone information not found in response.');
        }

        // Extract and format the timezone information
        const timezone = data.timezone;
        const formattedTimezone = timezone.split('/').slice(1).join('/');

        // Validate formatted timezone is not empty
        if (!formattedTimezone) {
            throw new Error('Unable to format timezone information.');
        }

        console.log(formattedTimezone);
    } catch (error) {
        clearTimeout(timeoutId);

        // Handle different error types with user-friendly messages
        if (error.name === 'AbortError') {
            console.error('Error: Request timed out. Please check your internet connection.');
            process.exit(1);
        } else if (error.message.includes('fetch failed') || error.code === 'ENOTFOUND') {
            console.error('Error: Network connection failed. Please check your internet connection.');
            process.exit(1);
        } else if (error.message.includes('HTTP error')) {
            console.error(`Error: ${error.message}`);
            console.error('The location service may be temporarily unavailable. Please try again later.');
            process.exit(1);
        } else if (error.message.includes('Invalid response')) {
            console.error(`Error: ${error.message}`);
            console.error('Please try again later.');
            process.exit(1);
        } else if (error.message.includes('Timezone information not found')) {
            console.error('Error: Could not retrieve timezone information from the service.');
            process.exit(1);
        } else if (error.message.includes('Unable to format timezone')) {
            console.error('Error: Received invalid timezone format.');
            process.exit(1);
        } else {
            // Generic error handler
            console.error(`Error: ${error.message || 'An unexpected error occurred.'}`);
            process.exit(1);
        }
    }
}

getTimezone();
