import React from "react";
import { Route, Switch } from "react-router-dom";
import { Card, Col, Row } from "reactstrap";
import BaseTable from "./components/BaseTable";
import '../../../assets/scss/custom-react-table.scss';

function Crawler(props) {
  const { match } = props;
  return (
    <Row>
      <Col sm="12">
        <Card code="BaseTable">
          <Switch>
            <Route exact path={match.path} component={BaseTable} />
          </Switch>
        </Card>
      </Col>
    </Row>
  );
}

Crawler.propTypes = {};

export default Crawler;
