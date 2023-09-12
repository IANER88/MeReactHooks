import SelectForm from '@/module/SelectForm';
import SelectIncrement from '@/module/SelectIncrement';
import vsf, { definePage } from '@vs/vsf-boot';
import {
  Section,
  VSFormItem,
  VSControlledForm,
  VSFormLayout,
  VSDataProvider,
  Input,
  VSForm,
  Select
} from '@vs/vsf-kit';
import React, { Fragment, useEffect, useState } from 'react';
import SelectCustomize from '../../components/func/SelectCustomize';
const ExamItemEdit = (props) => {
  const { data } = props;
  /**
   * ClinicExamItem
   * @type {ExamClinicItemDetailVoClinicItemBaseEntranceWebVo}
   */
  const [clinicExamItem, setClinicExamItem] = useState({});
  const [examDataSource, setExamDataSource] = useState([]);
  const [selectDataSource, setSelectDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([])
  const getExamData = async () => {
    const res = await vsf.services
      .ClinicItemBaseController_getExamClinicItemDetailById_f60f06({ id: props.data.id })
    setClinicExamItem({
      ...res.data,
      // examItemExtensionBtoList: res.data.examVsClinicItemDetailDto,
    });
    console.log(res);
  };
  const getDataInfo = async (params) => {
    const res =
      await vsf?.services?.MedicalInstitutionDtoController_getCurrentInstitutionWithDepartment_58c06a?.(
        {},
      );
    setExamDataSource(res.data);
  };
  const getExamInfo = async (params) => {
    const res =
      await vsf?.services?.ExamController_getExamClassWithBodyMethodById_d56c5a?.(
        { id: props.data.id },
      );
    return res?.data;
  };
  const getDataSource = async () => {
    const res =
      await vsf?.services?.MedicalInstitutionDtoController_getCurrentInstitution_b22926?.(
        {},
      );
    const data = [
      { label: res.data.institutionName, value: res.data.id },
      ...res.data.branchInstitutionList.map((item) => ({
        label: item.institutionName,
        value: item.id,
      })),
    ];
    setDataSource(data)
  }
  const getSelectDataSource = async (params) => {
    const res =
      await vsf?.services?.DepartmentDtoController_getAllByDepartmentInstitutionQto_9aefb9?.(
        {
          qto: {
            from: params?.pagination?.from ?? 0,
            size: params?.pagination?.size ?? 20,
            orderList: params?.orderList, // 排序结果
            ...params?.search, // 搜索结果
            ...params?.filters, // 过滤器结果
            ...(params?.extra ?? {}), // 传入的额外参数
          },
        },
      );
    setSelectDataSource(res.data.map((item) => ({
      label: `${item.departmentName}(${item.branchInstitution.institutionName})`,
      value: item.id
    })))
  }
  const getSite = async () => {
    const res =
      await vsf?.services?.ExamBodyDictionaryDtoController_getByExamClassId_99e20a?.(
        { examClassId: props.data.id },
      );
    return res.data.map((item) => ({
      label: item.examBodyName,
      value: item.id,
    }))
  }
  const getMethod = async () => {
    const res =
      await vsf?.services?.ExamMethodDictionaryDtoController_getByExamClassId_994cf6?.(
        { examClassId: props.data.id },
      );
    return res.data.map((item) => ({
      label: item.examMethodName,
      value: item.id
    }))
  }
  const map = (jets) => {
    const list = [];
    const recur = (jet) => {
      if (jet.children.length) {
        for (const el of jet.children) {
          list.push(recur(el))
        }
      }
      return {
        label: jet?.examClassName,
        value: jet?.id,
      };
    }
    list.push(recur(jets));
    return list
  };
  useEffect(() => {
    if (props.data) {
      const list = map(props.data)
      const bet = {
        examClass: list[0],
        examSubClass: list[1],
        examThirdClass: list[2]
      };
      vsf.refs.ExamForm.setFieldsValue({
        examVsClinicItemDetailDto: bet
      })
      getExamData()
      // setClinicExamItem()
    }
  }, [props.data])
  useEffect(() => {
    getSelectDataSource();
    getDataSource();
    getDataInfo();
  }, [])
  const Forms = (props) => {
    const {
      form
    } = props
    useEffect(() => {
      form.ref.setFieldsValue({
        ...form.ref.getFieldsValue(),
        examItemExtensionBtoList: {
          branchInstitutionId: form.value.value
        }
      })
    }, [form.value])
    return (
      <Fragment>
        <VSFormItem
          name={['examItemExtensionBtoList', 'branchInstitutionId']}
          label="院区"
          valueType="text"
          fieldProps={{}}
        />
        <VSFormLayout key="16" columnCount={4}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'useScope']}
            label="使用范围"
            valueType="select"
            dataSource={[
              { label: '全院', value: 'ALL' },
              { label: '住院', value: 'INP' },
              { label: '门诊', value: 'OUTP' },
            ]}
            rules={[{ required: true }]}
            fieldProps={{}}
          />

          <VSFormItem
            name={['examItemExtensionBtoList', 'examLocation']}
            label="检查地点"
            valueType="text"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 50 },
            ]}
            fieldProps={{}}
          />

          <VSFormItem
            name={['examItemExtensionBtoList', 'needAppointIndicator']}
            label="需预约"
            valueType="switch"
            initialValue={false}
            rules={[{ required: true }]}
            fieldProps={{}}
          />

          <VSFormItem
            name={['examItemExtensionBtoList', 'appointMethod']}
            label="预约方式"
            valueType="select"
            dataSource={vsf.stores.dbenums.enums.APPOINT_METHOD_DICT}
            fieldProps={{}}
          />
        </VSFormLayout>
        <VSFormLayout key="17" columnCount={2}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'dischargeCheckType']}
            label="出院校验类型"
            valueType="select"
            dataSource={[
              { label: '报告', value: 'REPORT' },
              { label: '计费', value: 'CHARGE' },
              { label: '全部', value: 'ALL' },
            ]}
            fieldProps={{}}
          />

          <VSFormItem
            name={['examItemExtensionBtoList', 'radiationFilmOption']}
            label="默认胶片选项"
            valueType="text"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 50 },
            ]}
            fieldProps={{}}
          />
        </VSFormLayout>
        <VSFormLayout key="18" columnCount={2}>
          <VSFormItem
            name={['examItemVsDepartmentBtoList']}
            label="限定开单科室"
            valueType="listBox"
            fieldProps={{
              children: <Select dataSource={selectDataSource} />
            }}
          />
        </VSFormLayout>
        <VSFormLayout key="19" columnCount={1}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'guideInfo']}
            label="导引信息"
            valueType="text"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 500 },
            ]}
            fieldProps={{}}
          />
        </VSFormLayout>
        <VSFormLayout key="20" columnCount={1}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'notice']}
            label="注意事项"
            valueType="textarea"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 65536 },
            ]}
            fieldProps={{
              autoSize: { minRows: 3, maxRows: 5 },
            }}
          />
        </VSFormLayout>
        <VSFormLayout key="21" columnCount={1}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'simpleNotice']}
            label="简版注意事项"
            valueType="textarea"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 65536 },
            ]}
            fieldProps={{
              autoSize: { minRows: 3, maxRows: 5 },
            }}
          />
        </VSFormLayout>
        <VSFormLayout key="22" columnCount={1}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'effect']}
            label="作用"
            valueType="textarea"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
            ]}
            fieldProps={{
              autoSize: { minRows: 3, maxRows: 5 },
            }}
          />
        </VSFormLayout>
        <VSFormItem
          name={['examItemVsMethodBtoList', 'id']}
          label="ID"
          style={{ display: 'none' }}
          valueType="digit"
          fieldProps={{}}
        />

        <VSFormLayout key="24" columnCount={1}>
          <VSFormItem
            name={['examItemExtensionBtoList', 'indicationDisease']}
            label="适应症"
            valueType="textarea"
            rules={[
              { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
            ]}
            fieldProps={{
              autoSize: { minRows: 3, maxRows: 5 },
            }}
          />
        </VSFormLayout>
      </Fragment>
    );
  };
  return (
    <VSControlledForm
      vsid="25275"
      id="ExamForm"
      // value={clinicExamItem}
      onChange={(_value) => {
        console.log(_value);
        props.onChange?.(_value);
      }}
    >
      <VSFormItem
        name={['id']}
        label="主键"
        style={{ display: 'none' }}
        valueType="digit"
        fieldProps={{}}
      />

      <VSFormItem
        name={['id']}
        label="主键"
        style={{ display: 'none' }}
        valueType="digit"
        fieldProps={{}}
      />

      <VSFormItem
        name={['examItemExtensionBtoList', 'id']}
        label="主键"
        style={{ display: 'none' }}
        valueType="digit"
        fieldProps={{}}
      />

      <VSFormLayout key="3" columnCount={3}>
        <VSFormItem
          name={['examVsClinicItemDetailDto', 'examClass']}
          label="检查大类"
          fieldProps={{ disabled: true, }}
          valueType="select"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 50 },
          ]}
        />

        <VSFormItem
          name={[
            'examVsClinicItemDetailDto',
            'examSubClass',
          ]}
          label="检查子类"
          fieldProps={{ disabled: true }}
          valueType="select"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 50 },
          ]}
        />

        <VSFormItem
          name={[
            'examVsClinicItemDetailDto',
            'examThirdClass',
          ]}
          label="检查小类"
          fieldProps={{ disabled: true, value: 1 }}
          valueType="select"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 50 },
          ]}
        />
      </VSFormLayout>
      <VSFormLayout key="4" columnCount={3}>
        {/* <VSFormItem
          name={['examItemExtensionBtoList', 'examClassId']}
          label="检查大类ID"
          valueType="digit"
          style={{
            display: "none"
          }}
          rules={[
            {
              message: '检查大类ID的值不合法',
              type: 'number',
              min: 0,
              max: null,
            },
            { required: true },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['examItemExtensionBtoList', 'examSubClassId']}
          label="检查子类ID"
          valueType="digit"
          style={{
            display: "none"
          }}
          rules={[
            {
              message: '检查子类ID的值不合法',
              type: 'number',
              min: 0,
              max: null,
            },
            { required: true },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['examItemExtensionBtoList', 'examThirdClassId']}
          label="检查小类ID"
          valueType="digit"
          style={{
            display: "none"
          }}
          rules={[
            {
              message: '检查小类ID的值不合法',
              type: 'number',
              min: 0,
              max: null,
            },
            { required: true },
          ]}
          fieldProps={{}}
        /> */}
      </VSFormLayout>
      <VSFormLayout key="5" columnCount={3}>
        <VSFormItem
          name={['btoParam', 'itemCode']}
          label="项目代码"
          valueType="text"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 20 },
            { required: true },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['btoParam', 'clinicItemName']}
          label="检查项目名称"
          valueType="text"
          rules={[
            {
              message: '项目名称长度不合法',
              type: 'string',
              min: 0,
              max: 1024,
            },
            { required: true },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['btoParam', 'inputCode']}
          label="拼音码"
          valueType="text"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 100 },
            { required: true },
          ]}
          fieldProps={{}}
        />
      </VSFormLayout>
      <VSFormLayout key="6" columnCount={4}>
        <VSFormItem
          name={['btoParam', 'limitGender']}
          label="限制性别"
          valueType="select"
          dataSource={[
            { label: '无限制', value: 'NO_LIMIT' },
            { label: '限男性', value: 'MALE_ONLY' },
            { label: '限女性', value: 'FEMALE_ONLY' },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['limitAgeSymbol']}
          label="限制年龄符号"
          valueType="select"
          dataSource={[
            { label: '大于', value: 'GT' },
            { label: '大于等于', value: 'GTE' },
            { label: '等于', value: 'EQUAL' },
            { label: '小于', value: 'LT' },
            { label: '小于等于', value: 'LTE' },
          ]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['limitAgeNumber']}
          label="限制年龄数值"
          valueType="digit"
          fieldProps={{}}
        />

        <VSFormItem
          name={['limitAgeUnit']}
          label="限制年龄单位"
          valueType="select"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 10 },
          ]}
          dataSource={[
            {
              label: '年',
              value: 'YEAR'
            },
            {
              label: '月',
              value: 'MONTH'
            },
            {
              label: '日',
              value: 'DAY'
            },
            {
              label: '周',
              value: 'WEEK'
            }
          ]}
          fieldProps={{}}
        />
      </VSFormLayout>

      <VSFormLayout key="8" columnCount={1}>
        <VSFormItem
          name={['examItemVsBodyBtoList']}
          label="检查部位"
          valueType="listBox"
          fieldProps={{
            children: (
              <VSForm style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <VSFormItem
                  name={['examBodyId']}
                  valueType="select"
                  dataSource={getSite}
                  fieldProps={{

                  }}
                />
                <VSFormItem
                  name={['chargeTimes']}
                  valueType="digit"
                  rules={[
                    {
                      message: '收费次数的值不合法',
                      type: 'number',
                      min: 0,
                      max: null,
                    },
                  ]}
                  fieldProps={{
                    placeholder: '---次数---'
                  }}
                />
              </VSForm>
            )
          }}
        />
      </VSFormLayout>
      <VSFormLayout key="9" columnCount={1}>
        <VSFormItem
          name={['examItemVsMethodBtoList']}
          label="检查方法"
          valueType="listBox"
          fieldProps={{ children: <Select dataSource={getMethod} /> }}
        />
      </VSFormLayout>

      <VSFormLayout key="11" columnCount={6}>
        <VSFormItem
          name={['anesthesiaIndicator']}
          label="是否默认麻醉"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['modifyAnesthesiaIndicator']}
          label="是否可选择麻醉"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['emptyAnesthesiaAssessmentIndicator']}
          label="是否麻醉评估"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['emptyStomachIndicator']}
          label="是否空腹"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['suffocateUrineIndicator']}
          label="是否憋尿"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />

        <VSFormItem
          name={['bedsideIndicator']}
          label="是否床边"
          valueType="switch"
          initialValue={false}
          rules={[{ required: true }]}
          fieldProps={{}}
        />
      </VSFormLayout >
      <VSFormLayout key="12" columnCount={1}>
        <VSFormItem
          name={['notice']}
          label="注意事项"
          valueType="textarea"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
          ]}
          fieldProps={{
            autoSize: { minRows: 3, maxRows: 5 }
          }}
        />
      </VSFormLayout>
      <VSFormLayout key="13" columnCount={1}>
        <VSFormItem
          name={['simpleNotice']}
          label="简版注意事项"
          valueType="textarea"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
          ]}
          fieldProps={{
            autoSize: { minRows: 3, maxRows: 5 }
          }}
        />
      </VSFormLayout>
      <VSFormLayout key="14" columnCount={1}>
        <VSFormItem
          name={['effect']}
          label="作用"
          valueType="textarea"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
          ]}
          fieldProps={{
            autoSize: { minRows: 3, maxRows: 5 }
          }}
        />
      </VSFormLayout>
      <VSFormLayout key="15" columnCount={1}>
        <VSFormItem
          name={['indicationDisease']}
          label="适应症"
          valueType="textarea"
          rules={[
            { message: '数据格式错误', type: 'string', min: 0, max: 4000 },
          ]}
          fieldProps={{
            autoSize: { minRows: 3, maxRows: 5 }
          }}
        />
      </VSFormLayout>
      <VSFormLayout columnCount={1}>
        <VSFormItem
          name={['examItemExtensionBtoList']}
          valueType="custom"
          customComponent={(props) => {
            return (
              <SelectForm
                label="院区"
                onChange={props.onChange}
                dataSource={dataSource}
                value={Array.isArray(props.value) ? props.value : []}
                children={<Forms />}
              />
            )
          }}
        />
      </VSFormLayout>
    </VSControlledForm >
  );
};
export default definePage(ExamItemEdit);
