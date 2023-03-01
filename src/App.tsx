/**
 * @see https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/react/index.tsx
 * @see https://authjs.dev/reference/utilities
 * @see https://stackoverflow.com/a/69418553
 */
import { createServer } from 'miragejs'
import { Session } from 'next-auth'
import { SessionProvider, signIn, useSession } from 'next-auth/react'

if (true) {
  createServer({
    routes() {
      this.urlPrefix = 'http://localhost:8080'
      this.namespace = 'api'

      this.post('/auth/signin/credentials', () => {
        return {
          status: 200,
          ok: true,
          url: 'http://localhost:3000/success',
        }
      })
      this.get('/auth/csrf', () => {
        return { credentials: {} }
      })
      this.get('/auth/providers', () => {
        return { credentials: {} }
      })

      this.get('/auth/session', () => {
        const now = new Date()
        const user = {
          user: {
            name: 'Foo',
            email: 'foo@bar.baz',
            image: null,
          },
          expires: (Math.random() < 0.5
            ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
            : new Date('1900-01-01')
          ).toISOString(),
        }
        console.log(user.expires)
        return {}
      })
    },
  })
}

function Component() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('onUnauthenticated')
    },
  })

  if (status === 'authenticated') {
  }

  return (
    <div>
      <pre>{JSON.stringify({ session, status })}</pre>
      {status === 'authenticated' ? (
        <p>Signed in as {session?.user?.email}</p>
      ) : (
        <button
          onClick={() =>
            signIn('credentials', { redirect: false, password: 'password' })
          }
        >
          Sign in
        </button>
      )}
    </div>
  )
}

function App() {
  const session: Session = {
    user: undefined,
    expires: new Date('1900-01-01').toISOString(),
  }

  return (
    <SessionProvider
      session={session}
      basePath="http://localhost:8080/api/auth"
      refetchInterval={15}
    >
      <Component />
    </SessionProvider>
  )
}

export default App
