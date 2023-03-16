// ** Reactstrap Imports
import { Button, Form, Input, Row, Col, Label } from 'reactstrap';

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';
import { useParams, useLocation } from 'react-router-dom';

// ** Styles
import '@styles/base/pages/page-misc.scss';
import React from 'react';
import { getUrlRedirectOauth2 } from 'api/etsy/oauth2/getUrlRedirectOauth2';
import ReactSelect from 'react-select';
import { notifyError } from 'utility/notify';

const scopeOptions = [
  {
    label: 'listings_r',
    value: 'listings_r',
    description:
      "Read a member's inactive and expired (i.e., non-public) listings.",
    isFixed: true,
  },
  {
    label: 'profile_r',
    value: 'profile_r',
    description: "Read a member's private profile information.",
    isFixed: true,
  },
  {
    label: 'shops_r',
    value: 'shops_r',
    description:
      "See a member's shop description, messages and sections, even if not (yet) public.",
    isFixed: true,
  },
  {
    label: 'address_r',
    value: 'address_r',
    description: "Read a member's shipping addresses",
    isFixed: true,
  },
  {
    label: 'recommend_r',
    value: 'recommend_r',
    description: "View a member's recommended listings.",
    isFixed: true,
  },
  {
    label: 'feedback_r',
    value: 'feedback_r',
    description:
      "View all details of a member's feedback (including purchase history.)",
    isFixed: true,
  },
  {
    label: 'address_w',
    value: 'address_w',
    description: "Update and delete a member's shipping address",
  },
  {
    label: 'billing_r',
    value: 'billing_r',
    description: "Read a member's Etsy bill charges and payments",
  },
  {
    label: 'cart_r',
    value: 'cart_r',
    description: 'Read the contents of a member’s cart',
  },
  {
    label: 'cart_w',
    value: 'cart_w',
    description: "Add and remove listings from a member's cart",
  },
  {
    label: 'listings_d',
    value: 'listings_d',
    description: "Delete a member's listings.",
  },
  {
    label: 'listings_w',
    value: 'listings_w',
    description: "Create and edit a member's listings.",
  },
  {
    label: 'email_r',
    value: 'email_r',
    description: "Read a member's email address",
  },
  {
    label: 'favorites_r',
    value: 'favorites_r',
    description: "View a member's favorite listings and users.",
  },
  {
    label: 'favorites_w',
    value: 'favorites_w',
    description:
      "Add to and remove from a member's favorite listings and users.",
  },
  {
    label: 'profile_w',
    value: 'profile_w',
    description: "Update a member's private profile information.",
  },
  {
    label: 'recommend_w',
    value: 'recommend_w',
    description: "Remove a member's recommended listings.",
  },
  {
    label: 'shops_w',
    value: 'shops_w',
    description: "Update a member's shop description, messages and sections.",
  },
  {
    label: 'transactions_r',
    value: 'transactions_r',
    description:
      "Read a member's purchase and sales data. This applies to buyers as well as sellers.",
  },
  {
    label: 'transactions_w',
    value: 'transactions_w',
    description: "Update a member's sales data.",
  },
];

const RegisterEtsyOauth2 = () => {
  const params = useParams();
  const location = useLocation();
  // ** Hooks
  const { skin } = useSkin();
  const [vendor, setVendor] = React.useState(
    new URLSearchParams(location.search).get('vendor') || '',
  );
  const [scopes, setScopes] = React.useState(scopeOptions);
  const [loading, setLoading] = React.useState(false);

  const illustration =
      skin === 'dark' ? 'coming-soon-dark.svg' : 'coming-soon.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const onConnectEtsy = async () => {
    try {
      if (!vendor) {
        return notifyError(
          'Vendor is require !.You must enter exactly the your vendor-name .',
        );
      }
      setLoading(true);
      const scopesAr = scopes.map((scope) => scope.value.trim());
      const url = await getUrlRedirectOauth2(
        scopesAr.join(' '),
        vendor,
        params?.uuid || null,
      );
      window.location.href = url.data;
    } catch (error) {
      setLoading(false);
      notifyError(error);
    }
  };
  React.useEffect(() => {
    onConnectEtsy();
  }, []);

  const orderOptions = (values) => {
    return scopes
      .filter((v) => v.isFixed)
      .concat(values.filter((v) => !v.isFixed));
  };
  const onChangeScopes = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = scopeOptions.filter((v) => v.isFixed);
        break;
    }

    setScopes(orderOptions(newValue));
  };
  const onChangeVendor = (e) => {
    setVendor(e.target.value);
  };
  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: 'none' } : base;
    },
  };
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <svg viewBox="0 0 139 95" version="1.1" height="28">
          <defs>
            <linearGradient
              x1="100%"
              y1="10.5120544%"
              x2="50%"
              y2="89.4879456%"
              id="linearGradient-1"
            >
              <stop stopColor="#000000" offset="0%"></stop>
              <stop stopColor="#FFFFFF" offset="100%"></stop>
            </linearGradient>
            <linearGradient
              x1="64.0437835%"
              y1="46.3276743%"
              x2="37.373316%"
              y2="100%"
              id="linearGradient-2"
            >
              <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
              <stop stopColor="#FFFFFF" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Artboard" transform="translate(-400.000000, -178.000000)">
              <g id="Group" transform="translate(400.000000, 178.000000)">
                <path
                  d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                  id="Path"
                  className="text-primary"
                  style={{ fill: 'currentColor' }}
                ></path>
                <path
                  d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                  id="Path"
                  fill="url(#linearGradient-1)"
                  opacity="0.2"
                ></path>
                <polygon
                  id="Path-2"
                  fill="#000000"
                  opacity="0.049999997"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                ></polygon>
                <polygon
                  id="Path-2"
                  fill="#000000"
                  opacity="0.099999994"
                  points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                ></polygon>
                <polygon
                  id="Path-3"
                  fill="url(#linearGradient-2)"
                  opacity="0.099999994"
                  points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                ></polygon>
              </g>
            </g>
          </g>
        </svg>
        <h2 className="brand-text text-primary ms-1">ListingManager</h2>
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">{`Hi, ${vendor}`}</h2>
          <h2 className="mb-1">Go to connect Etsy Api 🚀</h2>
          <p className="mb-3">
            "The term 'Etsy' is a trademark of Etsy, Inc. This application uses
            the Etsy API but is not endorsed or certified by Etsy, Inc."
          </p>
          <Form
            tag={Row}
            onSubmit={(e) => e.preventDefault()}
            className="row-cols-md-auto justify-content-center align-items-center m-0 mb-2 gx-3"
          >
            <div className="mb-1">
              <Label className="form-label" for="name-vendor">
                Vendor name
              </Label>
              <Input
                disabled={loading}
                value={vendor}
                onChange={(e) => onChangeVendor(e)}
                type="text"
                id="name-vendor"
                placeholder="Enter your vendor name"
                autoFocus={false}
              />
              <div className="text-danger">
                You must enter exactly your vendor-name .
              </div>
            </div>
            <Col sm="12" className="m-0 mb-1" style={{ width: '100%' }}>
              <ReactSelect
                value={scopes}
                isMulti
                styles={styles}
                isClearable={scopes.some((v) => !v.isFixed)}
                name="scopes"
                options={scopeOptions}
                placeholder="Scopes ..."
                onChange={onChangeScopes}
              />
            </Col>
            <Col sm="12" className="d-md-block d-grid ps-md-0 ps-auto">
              <Button
                className="mb-1 btn-sm-block"
                disabled={loading}
                color="primary"
                onClick={() => onConnectEtsy()}
              >
                Connect Etsy Store
              </Button>
            </Col>
          </Form>
          <img className="img-fluid" src={source} alt="Coming soon page" />
        </div>
      </div>
    </div>
  );
};
export default RegisterEtsyOauth2;
