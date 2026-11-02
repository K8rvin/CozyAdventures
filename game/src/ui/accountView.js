function rowText(title, hint = '') {
  const row = document.createElement('div');
  row.className = 'set-row';
  const box = document.createElement('div');
  box.className = 'set-text';
  const name = document.createElement('div');
  name.className = 'set-name';
  name.textContent = title;
  box.appendChild(name);
  if (hint) {
    const text = document.createElement('div');
    text.className = 'set-hint';
    text.textContent = hint;
    box.appendChild(text);
  }
  row.appendChild(box);
  return row;
}

function action(title, hint, label, onClick) {
  const row = rowText(title, hint);
  const button = document.createElement('button');
  button.className = 'ghost';
  button.textContent = label;
  button.addEventListener('click', onClick);
  row.appendChild(button);
  return { row, button };
}

function passwordInput(autocomplete, label = 'Пароль') {
  const wrapper = document.createElement('label');
  wrapper.className = 'set-text';
  const caption = document.createElement('span');
  caption.className = 'set-name';
  caption.textContent = label;
  const input = document.createElement('input');
  input.type = 'password';
  input.required = true;
  input.minLength = 10;
  input.autocomplete = autocomplete;
  input.dataset.passwordInput = autocomplete;
  wrapper.append(caption, input);
  return { wrapper, input };
}

export function createAccountSection(ctx) {
  const account = ctx.account || {
    snapshot: () => ({ configured: false, status: 'anonymous', supporter: { active: false } }),
    subscribe: (listener) => { listener({ configured: false, status: 'anonymous', supporter: { active: false } }); return () => {}; },
  };
  const section = document.createElement('section');
  section.className = 'panel set-section';
  section.dataset.accountSection = '1';
  const heading = document.createElement('h3');
  heading.textContent = '☁️ Аккаунт и издание';
  section.appendChild(heading);
  const accountStatus = document.createElement('div');
  section.appendChild(accountStatus);
  const authHost = document.createElement('div');
  section.appendChild(authHost);
  const syncHost = document.createElement('div');
  section.appendChild(syncHost);
  const transferHost = document.createElement('div');
  section.appendChild(transferHost);
  let authMode = 'login';
  let changeMode = false;

  function makeAuthForm(mode) {
    const form = document.createElement('form');
    form.dataset.authForm = mode;
    const email = document.createElement('input');
    if (mode !== 'change') {
      const emailLabel = document.createElement('label');
      emailLabel.className = 'set-text';
      const caption = document.createElement('span');
      caption.className = 'set-name';
      caption.textContent = 'Почта';
      email.type = 'email';
      email.required = true;
      email.maxLength = 254;
      email.autocomplete = 'email';
      email.dataset.emailInput = '1';
      emailLabel.append(caption, email);
      form.appendChild(emailLabel);
    }
    const current = passwordInput(mode === 'register' ? 'new-password' : 'current-password',
      mode === 'register' ? 'Пароль (минимум 10 символов)' : mode === 'change' ? 'Текущий пароль' : 'Пароль');
    form.appendChild(current.wrapper);
    const next = mode === 'change' ? passwordInput('new-password', 'Новый пароль (минимум 10 символов)') : null;
    if (next) form.appendChild(next.wrapper);
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'primary';
    submit.textContent = mode === 'register' ? 'Зарегистрироваться' : mode === 'change' ? 'Сменить пароль' : 'Войти';
    const error = document.createElement('div');
    error.className = 'set-hint';
    error.setAttribute('role', 'alert');
    form.append(submit, error);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      error.textContent = '';
      try {
        if (mode === 'register') await account.register({ email: email.value, password: current.input.value });
        else if (mode === 'login') await account.login({ email: email.value, password: current.input.value });
        else await account.changePassword({ currentPassword: current.input.value, newPassword: next.input.value });
        if (mode === 'change') {
          changeMode = false;
          ctx.toast('Пароль изменён. Другие сессии завершены.');
        }
      } catch (requestError) {
        error.textContent = requestError.message;
      } finally {
        current.input.value = '';
        if (next) next.input.value = '';
        submit.disabled = false;
      }
    });
    return form;
  }

  function renderAccount(snapshot) {
    accountStatus.innerHTML = '';
    authHost.innerHTML = '';
    syncHost.innerHTML = '';
    if (!snapshot.configured) {
      accountStatus.appendChild(rowText('Локальная игра', 'Сервер аккаунта не настроен. Все основные возможности и локальный сейв доступны без регистрации.'));
    } else if (snapshot.status === 'authenticated' && snapshot.profile) {
      const name = snapshot.profile.email || 'Хозяин лавки';
      accountStatus.appendChild(rowText(`Аккаунт: ${name}`, snapshot.supporter.active
        ? 'Издание хранителя активно. Спасибо за поддержку игры!'
        : 'Бесплатный аккаунт. Облако и supporter-витрина открываются одним разовым донатом.'));
      const change = action('Безопасность', 'После смены пароля остальные сессии завершатся.', changeMode ? 'Отмена' : 'Сменить пароль', () => {
        changeMode = !changeMode;
        renderAccount(account.snapshot());
      });
      accountStatus.appendChild(change.row);
      if (changeMode) accountStatus.appendChild(makeAuthForm('change'));
      const logout = action('Выход из аккаунта', 'Локальный прогресс и купленная косметика останутся на устройстве.', 'Выйти', async () => {
        await account.logout();
        ctx.persistence?.reset();
        ctx.toast('Вы вышли из аккаунта. Игра продолжается локально.');
      });
      accountStatus.appendChild(logout.row);
    } else {
      accountStatus.appendChild(rowText(snapshot.status === 'loading' ? 'Проверяем аккаунт…' : 'Игра без регистрации',
        snapshot.lastError || 'Почта используется только как логин. Письма не отправляются; восстановления по email нет.'));
      if (snapshot.status !== 'loading') {
        const modes = document.createElement('div');
        modes.className = 'pc-mode-picker';
        for (const [id, label] of [['login', 'Вход'], ['register', 'Регистрация']]) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `small pc-mode-option${authMode === id ? ' primary is-active' : ' ghost'}`;
          button.dataset.authMode = id;
          button.textContent = label;
          button.setAttribute('aria-pressed', String(authMode === id));
          button.addEventListener('click', () => {
            authMode = id;
            renderAccount(account.snapshot());
          });
          modes.appendChild(button);
        }
        authHost.append(modes, makeAuthForm(authMode));
      }
    }
    if (snapshot.status === 'authenticated') authHost.innerHTML = '';

    const sync = ctx.persistence?.getStatus?.() || { enabled: false, status: 'local' };
    if (snapshot.supporter.active) {
      const labels = {
        local: 'Локально', pending: 'Ждёт минутной отправки', syncing: 'Синхронизируем…',
        synced: 'Синхронизировано', offline: 'Офлайн — отправим позже',
        conflict: 'Нужен выбор при конфликте', error: 'Ошибка синхронизации',
      };
      const hint = `${labels[sync.status] || labels.local}. Автоматически раз в 60 секунд при изменениях; одна текущая копия без истории.`;
      const toggle = action('Облачное автосохранение', hint, sync.enabled ? 'Включено' : 'Выключено', async () => {
        await ctx.persistence.setEnabled(!sync.enabled);
      });
      toggle.button.setAttribute('aria-pressed', String(sync.enabled));
      toggle.button.className = `set-toggle${sync.enabled ? ' on' : ''}`;
      syncHost.appendChild(toggle.row);
      const now = action('Ручная синхронизация', sync.lastSyncedAt ? `Последняя: ${new Date(sync.lastSyncedAt).toLocaleString('ru-RU')}` : 'Можно не ждать минутного таймера.', 'Синхронизировать', async () => {
        now.button.disabled = true;
        try { await ctx.persistence.syncNow(); } catch (error) { ctx.toast(error.message); }
        now.button.disabled = false;
      });
      syncHost.appendChild(now.row);
    } else {
      syncHost.appendChild(rowText('Издание хранителя', 'Разовый донат откроет облачные автосохранения, четыре дополнительных образа рыцаря и музыкальные пресеты. Платёжный сервис будет подключён позже.'));
    }
  }

  const exportAction = action('Экспорт сейва', 'Бесплатно и без аккаунта: файл содержит игровой прогресс, но не сессию и не признак оплаты.', 'Скачать', () => ctx.exportSave());
  transferHost.appendChild(exportAction.row);
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = 'application/json,.json';
  file.hidden = true;
  file.dataset.saveImport = '1';
  file.addEventListener('change', async () => {
    if (file.files?.[0]) await ctx.importSave(file.files[0]);
    file.value = '';
  });
  const importAction = action('Импорт сейва', 'Файл будет проверен перед заменой текущего прогресса.', 'Выбрать файл', () => file.click());
  transferHost.append(importAction.row, file);

  const unsubscribe = account.subscribe(renderAccount);
  const unsubscribeSync = ctx.persistence?.subscribe(() => renderAccount(account.snapshot()));
  renderAccount(account.snapshot());
  return {
    element: section,
    destroy() { unsubscribe(); unsubscribeSync?.(); },
  };
}
