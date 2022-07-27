import 'antd/dist/antd.css';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getToken, formatNumber } from '../../utils/helpers';
import Highlighter from 'react-highlight-words';
import Head from '../../components/head'
import { Space, Input, Table, Button, Statistic, Checkbox, Tooltip, Popconfirm, notification } from "antd";
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { createHubspotLead, useLeads } from '../../utils/fetches';
import styles from './leads.module.scss';
import dayjs from 'dayjs';

const Leads = () => {
  const router = useRouter()
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [sortedItem, setSortedItem] = useState('id');
  const [sortedOrder, setSortedOrder] = useState('desc');
  const [searchedColumn, setSearchedColumn] = useState();
  const [searchedText, setSearchedText] = useState();
  const [hubspotData, setHubspotData] = useState();
  const [isHubspotLoading, setIsHubspotLoading] = useState(false)

  const { leads, isValidating, isLoading, error, mutate } = useLeads({
    page: page - 1,  //Empieza en page = 1 pero en api la pagina inicial es 0.
    limit,
    sortedItem,
    sortedOrder,
    [searchedColumn]: searchedText,
  }, getToken())

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/acceso')
    }
  }, [])

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchedText();
  }

  const renderResults = (text, row, dataIndex) => {
    if (searchedColumn === 'name' && searchedColumn === dataIndex) {
      return <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchedText]}
        autoEscape
        textToHighlight={`${row.name || ''} ${row.secondName || ''}`}
      />
    }
    if (dataIndex === 'name') {
      return `${row.name || ''} ${row.secondName || ''}`
    }
    return searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchedText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )
  }

  const handleSubmitHubspotLead = async () => {
    try {
      setIsHubspotLoading(true)
      await createHubspotLead(hubspotData, getToken())
      mutate()
      notification.success({
        message: 'Lead creado',
        description: `El ${hubspotData.brand} ${hubspotData.model} de ${hubspotData.name} ha sido agregado a Hubspot.`
      })

    } catch (e) {
      setIsHubspotLoading(false)
      notification.error({
        message: 'Ocurrió un error',
        description: e.message
      })
    }
  }

  const columnSearch = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar por ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchByText(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchByText(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Borrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    render: (text, row) => renderResults(text, row, dataIndex)

  })

  const renderCountryValue = (value) => {
    const countries = {
      cl: 'Chile',
      ar: 'Argentina',
      mx: 'México',
      uy: 'Uruguay'
    }
    return countries[value]
  }

  const renderHubspotLink = (row) => {
    if (!row.external_id) {
      return (<Tooltip title="Agregar a Hubspot">
        <Popconfirm placement="left" title='¿Crear lead en Hubspot?' onConfirm={handleSubmitHubspotLead} okText="Sí" cancelText="No">
          <Button loading={isHubspotLoading} type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={()=>setHubspotData(row)} />
        </Popconfirm>
      </Tooltip>)
    }
    if (row.external_id.toString().length < 5) {
      return `pipedrive: ${row.external_id} `
    }
    return <a href={`https://app.hubspot.com/contacts/8886399/deal/${row.external_id}`}>Ver en Hubspot</a>
  }

  const columns = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: 'Creado',
      key: 'created_at',
      dataIndex: 'created_at',
      align: 'center',
      render: (value) => dayjs(value).calendar()
    },
    {
      title: 'Contacto',
      children: [
        {
          title: 'Nombre',
          key: 'name',
          render: (_, row) => `${row.name || ''} ${row.secondName || ''}`,
          align: 'center',
          ...columnSearch('name')

        },
        {
          title: 'Email',
          key: 'email',
          dataIndex: 'email',
          align: 'center',
          ...columnSearch('email')
        },
        {
          title: 'Teléfono',
          key: 'phone',
          dataIndex: 'phone',
          align: 'center',
          ...columnSearch('phone')

        },
      ]
    },
    {
      title: 'Auto',
      children: [
        {
          title: 'Marca',
          dataIndex: 'brand',
          key: 'brand'
        },
        {
          title: 'Modelo',
          dataIndex: 'model',
          key: 'model'
        },
        {
          title: 'Versión',
          dataIndex: 'version',
          key: 'version'
        },
        {
          title: 'Año',
          key: 'year',
          dataIndex: 'year',
          align: 'center',
          sorter: true
        },
      ],
      ...columnSearch('brand')
    },

    {
      title: 'Prendado',
      key: 'prendado',
      dataIndex: 'prendado',
      align: 'center',
      render: (data, row) => {
        if (data) {
          return <Checkbox checked={data === 'No' ? false : true} />
        }
        return <div>--</div>
      }
    },
    {
      title: 'Papeles',
      key: 'papeles',
      dataIndex: 'papeles',
      align: 'center',
      render: (data, row) => {
        if (data) {
          return <Checkbox checked={data === 'No' ? false : true} />
        }
        return <div>--</div>
      }
    },
    {
      title: 'Dueños',
      key: 'owners',
      dataIndex: 'owners',
      align: 'center',
      sorter: true
    },
    {
      title: 'Kilómetros',
      key: 'kms',
      dataIndex: 'kms',
      align: 'center',
      render: (value) => <div>{formatNumber(value, 0)}</div>
    },
    {
      title: 'País',
      key: 'country_code',
      dataIndex: 'country_code',
      align: 'center',
      render: (value) => renderCountryValue(value),
      sorter: true
    },
    {
      title: 'Hubspot',
      key: 'external_id',
      dataIndex: 'external_id',
      align: 'center',
      sorter: true,
      render: (value, row) => renderHubspotLink(row)

    }
    //https://app.hubspot.com/contacts/8886399/deal/7057374823/
  ]

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
    if (!sorter.order) {
      setSortedItem();
      setSortedOrder();
      return
    }
    if (sorter.field[1] === 'totalBalance') {
      setSortedItem('UserBalane.balance')
    } else {
      setSortedItem(sorter.field);
    }
    const order = sorter.order === 'ascend' ? 'asc' : 'desc'
    setSortedOrder(order)
  }
  const handleSearchByText = (selectedKeys, confirm, dataIndex) => {
    setSearchedColumn(dataIndex);
    setSearchedText(selectedKeys[0])
    confirm();
  }
  return (
    <div className={styles.leads__container}>
      <Head title="Listado de leads" />
      <h2>Leads</h2>
      <Space direction="vertical">
        <Statistic title='Total' value={leads ? leads.count : 0} />
        <Table
          size='middle'
          bordered
          pagination={{
            position: ['none', 'bottomCenter'],
            total: leads ? leads.count : 0,
            pageSize: limit,
            showQuickJumper: true
          }}
          onChange={handleTableChange}
          columns={columns}
          dataSource={leads ? leads.rows : []}
          scroll={{ y: 400 }}
          loading={isLoading}
          locale
        />
      </Space>
    </div>

  )
}

export default Leads