
export default function Page() {
  return (<>
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🚗 Як здати на водійське посвідчення в Ірландії (категорія B – легкові автомобілі)
      </h1>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">1. PPS Number (персональний публічний номер)</h2>
            <p>Щоб почати процес, потрібно мати PPS Number (аналог податкового коду). Без нього не можна подати заявку на Learner Permit (учнівське посвідчення).</p>
            <a href="https://www.gov.ie/en/services/ppsn" className="link link-primary mt-2 inline-block">
              ➡️ Деталі: www.gov.ie/en/services/ppsn
            </a>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">2. Теоретичний тест (Driver Theory Test)</h2>
            <p className="font-semibold">📘 Що це таке:</p>
            <p>онлайн або в центрі тестування здаєш тест з правил дорожнього руху (теорія, знаки, безпека).</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>40 питань, щоб скласти — потрібно правильно відповісти на 35.</li>
              <li>Мова: доступна англійська, українська, російська.</li>
            </ul>
            <div className="mt-2 space-y-1">
              <p>💰 Вартість: €45</p>
              <p>🕐 Тривалість: ~45 хв</p>
            </div>
            <a href="https://www.theorytest.ie" className="link link-primary mt-2 inline-block">
              ➡️ www.theorytest.ie
            </a>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">3. Зір і здоров&#39;я</h2>
            <p>Перед подачею на учнівське посвідчення (Learner Permit), потрібно заповнити медичну форму:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>D501 – Заява про зір (оформлюється офтальмологом або GP).</li>
              <li>Якщо є медичні стани — ще форма D502.</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">4. Учнівське посвідчення (Learner Permit)</h2>
            <p>Це тимчасове посвідчення водія (термін дії – 2 роки), яке дозволяє практикувати водіння тільки під наглядом водія з повним посвідченням (мінімум 2 роки досвіду).</p>
            <a href="https://www.ndls.ie" className="link link-primary mt-2 inline-block">
              ➡️ www.ndls.ie (National Driver Licence Service)
            </a>
            <p className="font-semibold mt-3">📋 Потрібно:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>PPS Number</li>
              <li>Фото + підпис (онлайн або в NDLS офісі)</li>
              <li>Теоретичний тест (складений)</li>
              <li>Медична форма D501</li>
              <li>Адреса в Ірландії</li>
            </ul>
            <p className="mt-2">💰 Вартість: €35</p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">5. EDT — Essential Driver Training (12 уроків з інструктором)</h2>
            <p className="font-semibold">🧑‍🏫 Після отримання Learner Permit обов&#39;язково потрібно пройти 12 практичних уроків з ліцензованим інструктором (ADI).</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Тривалість кожного уроку – мінімум 1 година.</li>
              <li>Уроки вносяться в електронну систему MyEDT.</li>
            </ul>
            <a href="https://www.rsa.ie/services/learner-drivers/approved-driving-instructors/find-an-adi" className="link link-primary mt-2 inline-block">
              ➡️ Знайти інструктора: Find an ADI Instructor
            </a>
            <p className="mt-2">💰 Вартість уроків залежить від інструктора, орієнтовно: €30–€50 за урок.</p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">6. Практика на дорозі (мін. 6 місяців)</h2>
            <p>Перед здачею іспиту на повне посвідчення потрібно:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Пройти всі 12 EDT уроків</li>
              <li>Мати Learner Permit мінімум 6 місяців</li>
              <li>Бажано мати багато практики на різних типах доріг</li>
            </ul>
          </div>
        </div>

        {/* Step 7 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">7. Driving Test — практичний іспит</h2>
            <p className="font-semibold">🛣️ Це офіційний дорожній іспит з екзаменатором RSA. Включає:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Контроль автомобіля</li>
              <li>Маневри (паралельне паркування, розворот, екстрене гальмування тощо)</li>
              <li>Безпечне водіння на дорогах</li>
            </ul>
            <a href="https://www.rsa.ie/services/learner-drivers/the-driving-test" className="link link-primary mt-2 inline-block">
              ➡️ Book Your Driving Test
            </a>
            <div className="mt-2 space-y-1">
              <p>💰 Вартість: €85</p>
              <p>📅 Очікування: може тривати кілька тижнів.</p>
            </div>
          </div>
        </div>

        {/* Step 8 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">8. Отримання повного посвідчення (Full Driving Licence)</h2>
            <p>Після успішної здачі:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Отримаєш сертифікат про проходження тесту</li>
              <li>Йдеш на NDLS.ie і подаєш заявку на повне посвідчення</li>
            </ul>
            <p className="mt-2">💰 Вартість: €55 (на 10 років)</p>
          </div>
        </div>

        {/* Links */}
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">📎 Всі офіційні посилання:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Теоретичний тест: <a href="https://www.theorytest.ie" className="link link-primary">https://www.theorytest.ie</a>
              </li>
              <li>
                NDLS (Learner Permit & Full Licence): <a href="https://www.ndls.ie" className="link link-primary">https://www.ndls.ie</a>
              </li>
              <li>
                Інструктори: <a href="https://www.rsa.ie/services/learner-drivers/approved-driving-instructors/find-an-adi" className="link link-primary">https://www.rsa.ie/services/learner-drivers/approved-driving-instructors/find-an-adi</a>
              </li>
              <li>
                Практичний іспит: <a href="https://www.rsa.ie/services/learner-drivers/the-driving-test" className="link link-primary">https://www.rsa.ie/services/learner-drivers/the-driving-test</a>
              </li>
              <li>
                PPS Number: <a href="https://www.gov.ie/en/services/ppsn/" className="link link-primary">https://www.gov.ie/en/services/ppsn/</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div className="card bg-base-300 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">❗ Корисні поради:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Завжди мати &#39;L&#39; знак на машині, якщо ти з Learner Permit.</li>
              <li>Не можна водити на автомагістралі (motorways) з учнівським посвідченням.</li>
              <li>За порушення — штраф або втрата дозволу.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}