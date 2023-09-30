const SharedDispatch = require("./shared-dispatch");

/**
 * 此类用作消息分发的中央代理. 它期望在主线程/窗口上运行，并且必须通知所有将参与消息传递系统的辅助线程. 从消息传递系统中的任何上下文中，调度程序的"call"方法可以在任何参与上下文中提供的任何"service"上调用任何方法. The dispatch system will forward function arguments and return values across worker boundaries as needed. 调度系统将根据需要跨工作者边界转发函数参数并返回值
 * @see {WorkerDispatch}
 */
class CentralDispatch extends SharedDispatch {
  constructor() {
    super();

    /**
     * Map of channel name to worker or local service provider.
     * If the entry is a Worker, the service is provided by an object on that worker.
     * Otherwise, the service is provided locally and methods on the service will be called directly.
     * @see {setService}
     * @type {object.<Worker|object>}
     */
    this.services = {};

    /**
     * The constructor we will use to recognize workers.
     * @type {Function}
     */
    this.workerClass = typeof Worker === "undefined" ? null : Worker;

    /**
     * List of workers attached to this dispatcher.
     * @type {Array}
     */
    this.workers = [];
  }

  /**
   * Synchronously call a particular method on a particular service provided locally.
   * Calling this function on a remote service will fail.
   * @param {string} service - the name of the service.
   * @param {string} method - the name of the method.
   * @param {*} [args] - the arguments to be copied to the method, if any.
   * @returns {*} - the return value of the service method.
   */
  callSync(service, method, ...args) {
    const { provider, isRemote } = this._getServiceProvider(service);
    if (provider) {
      if (isRemote) {
        throw new Error(
          `Cannot use 'callSync' on remote provider for service ${service}.`
        );
      }

      return provider[method].apply(provider, args);
    }
    throw new Error(`Provider not found for service: ${service}`);
  }

  /**
   * Synchronously set a local object as the global provider of the specified service.
   * WARNING: Any method on the provider can be called from any worker within the dispatch system.
   * @param {string} service - a globally unique string identifying this service. Examples: 'vm', 'gui', 'extension9'.
   * @param {object} provider - a local object which provides this service.
   */
  setServiceSync(service, provider) {
    if (this.services.hasOwnProperty(service)) {
      console.warn(
        `Central dispatch replacing existing service provider for ${service}`
      );
    }
    this.services[service] = provider;
  }

  /**
   * Set a local object as the global provider of the specified service.
   * WARNING: Any method on the provider can be called from any worker within the dispatch system.
   * @param {string} service - a globally unique string identifying this service. Examples: 'vm', 'gui', 'extension9'.
   * @param {object} provider - a local object which provides this service.
   * @returns {Promise} - a promise which will resolve once the service is registered.
   */
  setService(service, provider) {
    /** Return a promise for consistency with {@link WorkerDispatch#setService} */
    try {
      this.setServiceSync(service, provider);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Add a worker to the message dispatch system. The worker must implement a compatible message dispatch framework.
   * The dispatcher will immediately attempt to "handshake" with the worker.
   * @param {Worker} worker - the worker to add into the dispatch system.
   */
  addWorker(worker) {
    if (this.workers.indexOf(worker) === -1) {
      this.workers.push(worker);
      worker.onmessage = this._onMessage.bind(this, worker);
      this._remoteCall(worker, "dispatch", "handshake").catch((e) => {
        console.error(`Could not handshake with worker: ${JSON.stringify(e)}`);
      });
    } else {
      console.warn("Central dispatch ignoring attempt to add duplicate worker");
    }
  }

  /**
   * Fetch the service provider object for a particular service name.
   * @override
   * @param {string} service - the name of the service to look up
   * @returns {{provider:(object|Worker), isRemote:boolean}} - the means to contact the service, if found
   * @protected
   */
  _getServiceProvider(service) {
    const provider = this.services[service];
    return (
      provider && {
        provider,
        isRemote: Boolean(
          this.workerClass && provider instanceof this.workerClass
        ),
      }
    );
  }

  /**
   * Handle a call message sent to the dispatch service itself
   * @override
   * @param {Worker} worker - the worker which sent the message.
   * @param {DispatchCallMessage} message - the message to be handled.
   * @returns {Promise|undefined} - a promise for the results of this operation, if appropriate
   * @protected
   */
  _onDispatchMessage(worker, message) {
    let promise;
    switch (message.method) {
      case "setService":
        promise = this.setService(message.args[0], worker);
        break;
      default:
        console.error(
          `Central dispatch received message for unknown method: ${message.method}`
        );
    }
    return promise;
  }
}

module.exports = new CentralDispatch();
