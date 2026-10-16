import { Card, PageHeader } from '../components/ui'

export default function ComingSoon({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        <p className="m-0 text-mute">This module is built in a later batch.</p>
      </Card>
    </>
  )
}
