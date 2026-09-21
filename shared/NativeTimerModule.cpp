#include "NativeTimerModule.h"
#include "stopwatchLib/Timer.h"

namespace facebook::react {

static Timer timer;

NativeTimerModule::NativeTimerModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeTimerModuleCxxSpec(std::move(jsInvoker)) {}

void NativeTimerModule::start(jsi::Runtime& rt) {
    timer.start();
}

void NativeTimerModule::stop(jsi::Runtime& rt) {
    timer.stop();
}

void NativeTimerModule::reset(jsi::Runtime& rt) {
    timer.reset();
}

double NativeTimerModule::getElapsedTime(jsi::Runtime& rt) {
    return static_cast<double>(timer.getElapsedTime());
}

std::string NativeTimerModule::getFormattedTime(jsi::Runtime& rt) {
    return timer.getFormattedTime();
}

} // namespace facebook::react
