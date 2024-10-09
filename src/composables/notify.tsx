import type { App } from 'vue';

export interface NotifyOptions {
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  duration: number;
  // eslint-disable-next-line ts/no-unsafe-function-type
  callback?: Function;
}

const DEFAULT_OPTIONS: NotifyOptions = {
  title: '',
  message: '',
  type: 'info',
  duration: 3000,
};

const icons: Record<string, string> = {
  info: 'icon-[carbon--information]',
  success: 'icon-[carbon--checkmark-outline]',
  error: 'icon-[carbon--close-outline]',
  warning: 'icon-[carbon--warning]',
};

const alertClass: Record<string, string> = {
  info: 'alert-info',
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
};

export function $notify(options: Partial<NotifyOptions>) {
  // * 合并默认配置
  options = Object.assign(DEFAULT_OPTIONS, options);
  // * 创建挂载点
  const root = document.getElementById('notify');
  if (!root) {
    return;
  }
  const alert = document.createElement('div');
  alert.className = 'w-full';
  root.appendChild(alert);
  // * 创建通知实例
  let note: App;
  function handleClick() {
    note.unmount();
    alert.remove();
    options.callback?.();
  };
  note = createApp(
    defineComponent({
      render() {
        return (
          <div
            onClick={handleClick}
            role="alert"
            class={`alert ${alertClass[options.type || 'info']}`}
          >
            <span class={icons[options.type || 'info']}></span>
            <div>
              <h3 class="font-bold">{options.title}</h3>
              <div class="text-xs">{options.message}</div>
            </div>
          </div>
        );
      },
    }),
  );
  // * 挂载通知实例
  note.mount(alert);
  // * 定时销毁
  setTimeout(handleClick, options.duration);
}

// eslint-disable-next-line ts/no-unsafe-function-type
export function catchNotify(func: Function) {
  return async (...args: any[]) => {
    try {
      return await func(...args);
    }
    catch (error) {
      $notify({
        title: 'Error',
        message: (error as Error).message,
        type: 'error',
        duration: 5000,
      });
      throw error;
    }
  };
}

// eslint-disable-next-line ts/no-unsafe-function-type
export function catchNotifySync(func: Function) {
  return (...args: any[]) => {
    try {
      return func(...args);
    }
    catch (error) {
      $notify({
        title: 'Error',
        message: (error as Error).message,
        type: 'error',
        duration: 5000,
      });
      throw error;
    }
  };
}
