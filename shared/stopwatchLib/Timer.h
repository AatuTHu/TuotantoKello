#pragma once 
#include <atomic> 
#include <thread> 
#include <chrono> 
#include <string> 
#include <mutex> 

class Timer {
public:
Timer() : running(false), elapsedMs(0) {}

void start() {
	if (!running) {
			running = true;
			startPoint = std::chrono::steady_clock::now();
			timerThread = std::thread(&Timer::run, this);
	}
}

void stop() {
	if (running) {
			running = false;
			if (timerThread.joinable()) timerThread.join();
			// Update elapsed
			auto now = std::chrono::steady_clock::now();
			elapsedMs += std::chrono::duration_cast<std::chrono::milliseconds>(now - startPoint).count();
	}
}

void reset() {
	stop();
	std::lock_guard<std::mutex> lock(mutex);
	elapsedMs = 0;
}

int64_t getElapsedTime() {
	std::lock_guard<std::mutex> lock(mutex);
	if (running) {
			auto now = std::chrono::steady_clock::now();
			return elapsedMs + std::chrono::duration_cast<std::chrono::milliseconds>(now - startPoint).count();
	}
	return elapsedMs;
}

std::string getFormattedTime() {
	std::lock_guard<std::mutex> lock(mutex);

	int64_t ms = elapsedMs;
	if (running) {
			auto now = std::chrono::steady_clock::now();
			ms += std::chrono::duration_cast<std::chrono::milliseconds>(now - startPoint).count();
	}

	int totalSeconds = static_cast<int>(ms / 1000);
	int h = totalSeconds / 3600;
	int m = (totalSeconds % 3600) / 60;
	int s = totalSeconds % 60;

	char buffer[12];
	snprintf(buffer, sizeof(buffer), "%02d:%02d:%02d", h, m, s);
	return std::string(buffer);
}


private:
std::atomic<bool> running;
std::thread timerThread;
std::mutex mutex;

int64_t elapsedMs;
std::chrono::steady_clock::time_point startPoint;

void run() {
	while (running) {
			std::this_thread::sleep_for(std::chrono::milliseconds(16));
	}
}
};
