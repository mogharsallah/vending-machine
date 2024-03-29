import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { createSwaggerSpec } from 'next-swagger-doc'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

import * as OpenSpecsApi from '../docs/openspec-api.json'

const SwaggerUI = dynamic<{
  spec: any
}>(import('swagger-ui-react'), { ssr: false })

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SwaggerUI spec={spec} />
}

export default ApiDoc

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({ definition: OpenSpecsApi })

  return {
    props: {
      spec,
    },
  }
}
