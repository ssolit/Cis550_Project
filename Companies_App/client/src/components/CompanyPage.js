import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';




import MenuBar from '../components/MenuBar';
import { getCompanySearch, getCompany } from 'companyfetcher'
const wideFormat = format('.3r');

const companyColumns = [
    {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        render: (text, row) => <a href={`/company?id=${row.CName}`}>{text}</a>
    },
    {
        title: 'City',
        dataIndex: 'City',
        key: 'City',
        sorter: (a, b) => a.City.localeCompare(b.City)
    },
    {
        title: 'State',
        dataIndex: 'State',
        key: 'State',
        sorter: (a, b) => a.State.localeCompare(b.State)
    },
    {
        title: 'Salary',
        dataIndex: 'Salary',
        key: 'Salary',
        sorter: (a, b) => a.Salary - b.Salary

    }
];


class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roleQuery: '',
            jobQuery: '',
            cityQuery: '',
            salaryQuery: 0,
            selectedCompanyId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedComapnyDetails: null,
            playersResults: []
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleRoleQueryChange = this.handleRoleQueryChange.bind(this)
        this.handleJobQueryChange = this.handleJobQueryChange.bind(this)
        this.handleCityQueryChange = this.handleCityQueryChange.bind(this)
        this.handleSalaryChange = this.handleSalaryChange.bind(this)
    }

    

    handleRoleQueryChange(event) {
        this.setState({ roleQuery: event.target.value })
    }

    handleJobQueryChange(event) {
        this.setState({ jobQuery: event.target.value })
    }

    handleSalaryChange(value) {
        this.setState({ salaryQuery: value[0] })
    }

    handleCityQueryChange(event) {
        this.setState({ cityQuery: event.target.value })
    }



    updateSearchResults() {
        //TASK 23: call getCompanySearch and update playerResults in state. See componentDidMount() for a hint
        getCompanySearch(this.state.roleQuery, this.state.jobQuery, this.state.cityQuery, this.state.salaryQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })
    }

    componentDidMount() {
        getCompanySearch(this.state.roleQuery, this.state.jobQuery, this.state.cityQuery, this.state.salaryQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })

        getCompany(this.state.selectedCompanyId).then(res => {
            this.setState({ selectedComapnyDetails: res.results[0] })
        })
    }

    render() {
        return (

            <div>

                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Name</label>
                            <FormInput placeholder="Name" value={this.state.roleQuery} onChange={this.handleroleQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Nationality</label>
                            <FormInput placeholder="Nationality" value={this.state.jobQuery} onChange={this.handlejobQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Club</label>
                            <FormInput placeholder="Club" value={this.state.clubQuery} onChange={this.handleClubQueryChange} />
                        </FormGroup></Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Rating</label>
                            <Slider range defaultValue={[50, 100]} onChange={this.handleRatingChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Potential</label>
                            <Slider range defaultValue={[50, 100]} onChange={this.handlePotentialChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider />
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>Players</h3>
                    <Table dataSource={this.state.playersResults} columns={companyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div>

                <Divider />

                {this.state.selectedComapnyDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                    
                        <CardBody>
                        <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            <h3>{this.state.selectedComapnyDetails.Name}</h3>

                            </Col>

                            <Col flex={2} style={{ textAlign: 'right' }}>
                            <img src={this.state.selectedComapnyDetails.Photo} referrerpolicy="no-referrer" alt={null} style={{height:'15vh'}}/>

                            </Col>
                        </Row>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                <h5>{this.state.selectedComapnyDetails.Club}</h5>
                                </Col>
                                <Col>
                                <h5>{this.state.selectedComapnyDetails.JerseyNumber}</h5>
                                </Col>
                                <Col>
                                <h5>{this.state.selectedComapnyDetails.BestPosition}</h5>
                                </Col>
                            </Row>
                            <br>
                            </br>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                    Age: {this.state.selectedComapnyDetails.Age}
                                </Col>
                                <Col>
                                    Height: {this.state.selectedComapnyDetails.Height}
                                </Col>
                                <Col>
                                    Weight: {this.state.selectedComapnyDetails.Weight}
                                </Col>
                                <Col flex={2} style={{ textAlign: 'right' }}>
                                {this.state.selectedComapnyDetails.Nationality}
                                    <img src={this.state.selectedComapnyDetails.Flag} referrerpolicy="no-referrer" alt={null} style={{height:'3vh', marginLeft: '1vw'}}/>
                                </Col>

                            </Row>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                    Value: {this.state.selectedComapnyDetails.Value}
                                </Col>
                                <Col>
                                    Release Clause: {this.state.selectedComapnyDetails.ReleaseClause}
                                </Col>
                                <Col>
                                    Wage: {this.state.selectedComapnyDetails.Wage}
                                </Col>
                                <Col>
                                    Contract Valid Until: {this.state.selectedComapnyDetails.ContractValidUntil}
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>

                    <Card style={{marginTop: '2vh'}}>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                                <h6>Skill</h6>
                                    <Rate disabled defaultValue={this.state.selectedComapnyDetails.Skill} />
                                <h6>Reputation</h6>
                                    <Rate disabled defaultValue={this.state.selectedComapnyDetails.InternationalReputation} />
                                <Divider/>
                                <h6>Best Rating</h6>
                                    <Progress style={{ width: '20vw'}} value={this.state.selectedComapnyDetails.BestOverallRating} >{this.state.selectedComapnyDetails.BestOverallRating}</Progress>
                                <h6>Potential</h6>
                                    <Progress style={{ width: '20vw'}} value={this.state.selectedComapnyDetails.Potential} >{this.state.selectedComapnyDetails.Potential}</Progress>
                                <h6>Rating</h6>
                                    <Progress style={{ width: '20vw'}} value={this.state.selectedComapnyDetails.Rating} >{this.state.selectedComapnyDetails.Rating}</Progress>
                            </Col >
                            <Col  push={2} flex={2}>
                                {this.state.selectedComapnyDetails.BestPosition === 'GK' ? <RadarChart
                                data={[this.state.selectedComapnyDetails]}
                                tickFormat={t => wideFormat(t)}
                                startingAngle={0}
                                domains={[
                                    { name: 'Penalties', domain: [0, 100], getValue: d => d.GKPenalties },
                                    { name: 'Diving', domain: [0, 100], getValue: d => d.GKDiving },
                                    { name: 'Handling', domain: [0, 100], getValue: d => d.GKHandling },
                                    { name: 'Kicking', domain: [0, 100], getValue: d => d.GKKicking },
                                    { name: 'Positioning', domain: [0, 100], getValue: d => d.GKPositioning },
                                    { name: 'Reflexes', domain: [0, 100], getValue: d => d.GKReflexes }
                                ]}
                                width={450}
                                height={400}
                                /> : <RadarChart
                                data={[this.state.selectedComapnyDetails]}
                                tickFormat={t => wideFormat(t)}
                                startingAngle={0}
                                domains={[
                                    { name: 'Agility', domain: [0, 100], getValue: d => d.NAdjustedAgility },
                                    { name: 'Ball Control', domain: [0, 100], getValue: d => d.NBallControl },
                                    { name: 'Passing', domain: [0, 100], getValue: d => d.NPassing },
                                    { name: 'Positioning', domain: [0, 100], getValue: d => d.NPositioning },
                                    { name: 'Stamina', domain: [0, 100], getValue: d => d.NStamina },
                                    { name: 'Strength', domain: [0, 100], getValue: d => d.NStrength }
                                ]}
                                width={450}
                                height={400}
                                
                                />}

                            </Col>
                            </Row>
                        </CardBody>
                    </Card>

                </div> : null}

            </div>
        )
    }
}

export default CompanyPage

