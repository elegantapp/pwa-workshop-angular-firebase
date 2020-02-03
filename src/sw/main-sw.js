importScripts('ngsw-worker.js');

function navigateOnNotificationClick(notificationAction) {
  const [action, id] = notificationAction.split(':');

  if (action === 'speaker') {
    return clients.openWindow(`/app/tabs/speakers/speaker-details/${id}`);
  } else if (action === 'session') {
    return clients.openWindow(`/app/tabs/schedule/session/${id}`);
  }

  return clients.openWindow(`/`);
}

addEventListener('notificationclick', event => {
  event.waitUntil(async function() {
    const allClients = await clients.matchAll({
      type: 'window'
    });
    console.log('Inspect all the clients attached to the sw', allClients);

    let pwaClient;

    // Focus if there's only one client
    if (allClients.length === 1) {
      pwaClient = allClients[0];
      pwaClient.focus();
    }

    // TODO: replace the code block above with the following when it's possible to preserve search params globally in Angular
    // https://github.com/angular/angular/issues/12664
    // for (const client of allClients) {
    //   const url = new URL(client.url);
    //   const utmSource = url.searchParams.get('utm_source');
    //   console.log(client, url);
    //
    //   if (utmSource === 'home_screen') {
    //     client.focus();
    //     pwaClient = client;
    //     break;
    //   }
    // }

    // If there's no active client, focus by calling openWindow()
    if (!pwaClient) {
      pwaClient = await openWindowByAction(event.action || (event.notification.actions && event.notification.actions.length ? event.notification.actions[0].action : null));
    }
  }());
});
