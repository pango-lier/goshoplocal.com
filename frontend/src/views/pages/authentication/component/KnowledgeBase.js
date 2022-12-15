// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardImg } from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-knowledge-base.scss'

const KnowledgeBase = () => {
  // ** States
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        id: 1,
        category: 'design-template',
        img: require('@src/assets/images/illustration/sales.svg').default,
        title: 'Design Template',
        desc: 'Apply and manage listing templates and import any existing templates.Thousands of new awe-inspiring designed templates created for your business brand. It has never been easier to revolutionize your business.'
      },
      {
        id: 2,
        category: 'Listing-manager',
        img: require('@src/assets/images/illustration/email.svg').default,
        title: 'Listings Management',
        desc: 'With our exclusive tool, you can sync your multi-platform business. Listing on Amazon is now easier than ever. Create stunning templates, handle requests, messages, and more.'
      },
      {
        id: 3,
        category: 'api-questions',
        img: require('@src/assets/images/illustration/marketing.svg').default,
        title: 'Import, Export & Sync',
        desc: 'Quickly select products and list to Amazon.Import existing products direct from your sales channels including Amazon or via CSV.'
      },
      {
        id: 4,
        category: 'personalization',
        img: require('@src/assets/images/illustration/api.svg').default,
        title: 'View Listings by Sales Channel',
        desc: 'View all active and historic activity. Revise active listings. Relist ended listings, using the same listing settings.'
      },
      {
        id: 5,
        category: 'email-marketing',
        img: require('@src/assets/images/illustration/personalization.svg').default,
        title: 'Smart product recommendations',
        desc: 'AI-powered recommendations generate repeat sales while you focus on acquiring new customers'
      },
      {
        id: 6,
        category: 'demand-generation',
        img: require('@src/assets/images/illustration/demand.svg').default,
        title: 'Automated order fulfillment',
        desc: 'Chip uses a smart fulfillment network to source and fulfill products from all over the world'
      },
      // {
      //   id: 7,
      //   category: 'badge',
      //   img: require('@src/assets/images/illustration/badge.svg').default,
      //   title: 'View Listings by Sales Channel',
      //   desc: 'View all active and historic activity. Revise active listings. Relist ended listings, using the same listing settings.'
      // },
      // {
      //   id: 8,
      //   category: 'faq-illustrations',
      //   img: require('@src/assets/images/illustration/faq-illustrations.svg').default,
      //   title: 'Smart product recommendations',
      //   desc: 'AI-powered recommendations generate repeat sales while you focus on acquiring new customers'
      // },
      // {
      //   id: 9,
      //   category: 'pricing-Illustration',
      //   img: require('@src/assets/images/illustration/pricing-Illustration.svg').default,
      //   title: 'Automated order fulfillment',
      //   desc: 'Chip uses a smart fulfillment network to source and fulfill products from all over the world'
      // }
    ])
  }, [])

  const Content = ({ item }) => (
    <Col className='kb-search-content' key={item.id} md='4' sm='6'>
      <Card>
        <Link to={`/pages/knowledge-base/${item.category}`}>
          <CardImg src={item.img} alt='knowledge-base-image' top />
          <CardBody className='text-center'>
            <h4>{item.title}</h4>
            <p className='text-body mt-1 mb-0'>{item.desc}</p>
          </CardBody>
        </Link>
      </Card>
    </Col>
  )

  const renderContent = () => {
    return data.map(item => {
      return <Content key={item.id} item={item} />
    })
  }

  return (
    <Fragment>
      <div id='knowledge-base-content'>
        <Row className='kb-search-content-info match-height'>{renderContent()}</Row>
      </div>
    </Fragment>
  )
}

export default KnowledgeBase
