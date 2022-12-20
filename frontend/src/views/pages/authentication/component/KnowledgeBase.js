// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardImg, CardFooter, CardTitle } from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-knowledge-base.scss'

const KnowledgeBase = () => {
  // ** States
  const [data, setData] = useState([]);
  const [dataMarket, setDataMarket] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [images, setImages] = useState([]);
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
        desc: 'With our exclusive tool, you can sync your multi-platform business. Listing on Platforms is now easier than ever. Create stunning templates, handle requests, messages, and more.'
      },
      {
        id: 4,
        category: 'personalization',
        img: require('@src/assets/images/illustration/api.svg').default,
        title: 'Statistic Powerful and Chart History',
        desc: 'Powerful statistics help you choose the best products.View all active and historic activity. Revise active listings. Relist ended listings, using the same listing settings.'
      },
      {
        id: 3,
        category: 'api-questions',
        img: require('@src/assets/images/illustration/marketing.svg').default,
        title: 'Import, Export & Sync',
        desc: 'Quickly select products and list to Amazon, Etsy or Ebay. Import existing products direct from your sales channels including Amazon or via CSV.'
      },

      {
        id: 5,
        category: 'Multiple Platforms and Suppliers',
        img: require('@src/assets/images/illustration/personalization.svg').default,
        title: 'Multiple Platforms and Suppliers',
        desc: 'We provide useful solutions on many PlatForms (Etsy, Amazon, Ebay) and POD Suppliers (Printify, Gearment, Geargag, Printway, Customcat, Dreamship).'
      },
      {
        id: 6,
        category: 'demand-generation',
        img: require('@src/assets/images/illustration/demand.svg').default,
        title: 'Automated order fulfillment',
        desc: 'Chip uses a smart fulfillment network to source and fulfill products from all over the world. Auto submit tracking on any platforms.'
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
    setDataMarket([
      {
        id: 1,
        img: require('@src/assets/images/market/etsy.jpg').default,
        title: 'Etsy',
      },
      {
        id: 2,

        img: require('@src/assets/images/market/amazon.svg').default,
        title: 'Amazon'
      },
      {
        id: 3,
        img: require('@src/assets/images/market/ebay.svg').default,
        title: 'Ebay',
      },]);
    setSupplier([
      {
        id: 1,
        img: require('@src/assets/images/market/customcat.png').default,
        title: 'Customcat',
      },
      {
        id: 2,

        img: require('@src/assets/images/market/dreamship.png').default,
        title: 'Dreamship'
      },
      {
        id: 3,
        img: require('@src/assets/images/market/geargag.png').default,
        title: 'Geargag',
      },

      {
        id: 4,
        img: require('@src/assets/images/market/gearment.png').default,
        title: 'Customcat',
      },
      {
        id: 5,

        img: require('@src/assets/images/market/printify.png').default,
        title: 'Printify'
      },
      {
        id: 6,
        img: require('@src/assets/images/market/printway.ico').default,
        title: 'Printway',
      },
    ]);

    setImages([
      {
        id: 1,
        img: require('@src/assets/images/market/statitics.png').default,
        title: 'Statitics Powerful',
      },
      {
        id: 2,

        img: require('@src/assets/images/market/chart.png').default,
        title: 'History Sale Chart'
      },
      {
        id: 3,
        img: require('@src/assets/images/market/template.png').default,
        title: 'Manage Easy Template',
      },
      {
        id: 4,
        img: require('@src/assets/images/market/designs.png').default,
        title: 'Manage Designs',
      },
    ]);
  }, [])

  const Content = ({ item }) => (
    <Col className='kb-search-content' key={item.id} xxl='4' xl='6' sm='12'>
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

  const ContentMarket = ({ item }) => (
    <Col className='kb-search-content' key={item.id} xxl='4' xl='6' sm='12'>
      <Card>
        <CardImg className='text-center' style={{ marginLeft: "40px", height: "35px", width: "100px" }} src={item.img} alt='knowledge-base-image' top />
      </Card>
    </Col>
  )
  const renderContentMarket = () => {
    return dataMarket.map(item => {
      return <ContentMarket key={item.id} item={item} />
    })
  }

  const ContentSupplier = ({ item }) => (
    <Col className='kb-search-content' key={item.id} xxl='4' xl='6' sm='12'>
      <Card >
        <CardImg className='text-center' style={{ marginLeft: "40px", height: "100px", width: "100px" }} src={item.img} alt='knowledge-base-image' top />
        <CardBody>
          <h4>{item.title}</h4>
        </CardBody>
      </Card>
    </Col>
  )
  const renderContentSupplier = () => {
    return supplier.map(item => {
      return <ContentSupplier key={item.id} item={item} />
    })
  }

  const ContentImage = ({ item }) => (
    <Col className='kb-search-content' key={item.id} sm='12'>
      <Card style={{ padding: "20px" }}>
        <CardTitle className='text-center'>{item.title}</CardTitle>
        <CardImg className='text-center' style={{ height: "auto", width: "100%" }} src={item.img} alt='images' top />
      </Card>
    </Col>
  )
  const renderContentImage = () => {
    return images.map(item => {
      return <ContentImage key={item.id} item={item} />
    })
  }
  return (
    <Fragment>
      <div id='knowledge-base-content' className='mt-3'>
        <Card style={{ padding: "20px" }}>
          <CardTitle className='text-center'>Our Supported Platforms</CardTitle>
          <Row id="render-platforms">
            {renderContentMarket()}
          </Row>
          <CardFooter className='text-center' style={{ fontWeight: "bold" }}>The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.</CardFooter>
        </Card>
        <div>
          <div className='text-center mb-1' style={{ fontWeight: "bold", fontSize: "18px" }}>"Faster, easier and clearer and Use statistical power"</div>
          <Row className='kb-search-content-info match-height'>{renderContent()}</Row>
        </div>
        <Card style={{ padding: "20px" }}>
          <CardTitle className='text-center'>Our Partner and Suppliers</CardTitle>
          <Row id="render-suppliers">
            {renderContentSupplier()}
          </Row>
        </Card>

        <Row id="render-description">
          {renderContentImage()}
        </Row>

      </div>
    </Fragment>
  )
}

export default KnowledgeBase
