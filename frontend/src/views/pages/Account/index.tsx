import React from "react";
import { Route, Switch } from "react-router-dom";
import { Card, Col, Row } from "reactstrap";
import BaseTable from "./components/BaseTable";
import './scss/react-table.scss';

function User(props) {
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

User.propTypes = {};

export default User;
