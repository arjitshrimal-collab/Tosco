const signals = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 3L4 7v8c0 5.25 4.3 10.15 10 11.35C19.7 25.15 24 20.25 24 15V7L14 3Z"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M10 14l2.5 2.5L18 11"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Lifetime Warranty',
    body: 'Every piece, forever protected',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 4l3.09 5.26L24 10.9l-4.95 5.01 1.18 7.09L14 20l-6.23 3.5L9 16.41 4 10.9l6.91-1.64L14 4Z"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    title: 'GIA-Certified Stones',
    body: 'Authenticity in every facet',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="#B8935A" strokeWidth="1.5" />
        <path
          d="M4 14h20M14 4c-3 4-3 12 0 20M14 4c3 4 3 12 0 20"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Complimentary Worldwide Shipping',
    body: 'Delivered to your door',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M8 14a6 6 0 1 0 6-6H8"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14l3-3M8 14l3 3"
          stroke="#B8935A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: '30-Day Returns',
    body: 'Wear it with confidence',
  },
]

export default function TrustSignals() {
  return (
    <section
      className="py-16 px-4"
      style={{
        background: '#F2EDE4',
        borderTop: '1px solid #B8935A',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="flex flex-col items-center gap-4 text-center"
            >
              {/* Icon ring */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(184,147,90,0.08)',
                  border: '1px solid rgba(184,147,90,0.2)',
                }}
              >
                {signal.icon}
              </div>

              <div>
                <h3
                  className="font-display text-lg font-medium"
                  style={{ color: '#1A1A1A' }}
                >
                  {signal.title}
                </h3>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: '#9C9080' }}
                >
                  {signal.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
