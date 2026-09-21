#pragma once

#include <AppSpecsJSI.h>

#include <memory>
#include <string>

namespace facebook::react {

class NativeTimerModule : public NativeTimerModuleCxxSpec<NativeTimerModule> {
public:
  NativeTimerModule(std::shared_ptr<CallInvoker> jsInvoker);
  void start(jsi::Runtime& rt);
  void stop(jsi::Runtime& rt);
  void reset(jsi::Runtime& rt);
  double getElapsedTime(jsi::Runtime& rt);
  std::string getFormattedTime(jsi::Runtime& rt);
};

} // namespace facebook::react
