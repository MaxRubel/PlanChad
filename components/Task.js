import { useState, useEffect } from 'react';
import { Collapse, Button as ButtonBoot } from 'react-bootstrap';
import { trashIcon } from '../public/icons';

export default function Task() {
  const handleCollapse = () => {
    // handleFreshness();
    // setFormInput((prevVal) => ({ ...prevVal, expanded: !prevVal.expanded }));
  };

  return (
    <>
      <div className="task">
        {/* -------line-side------------- */}
        <div className="marginL" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div id="empty" />
          <div id="line" style={{ borderLeft: '2px solid rgb(84, 84, 84)', display: 'grid', gridTemplateRows: '1fr 1fr' }}>
            <div id="empty" style={{ borderBottom: '2px solid rgb(84, 84, 84)' }} />
            <div />
          </div>
        </div>
        <div style={{ margin: '1% 0%' }}>
          <div>
            <div className="card">
              <div className="card-header 2">
                <div className="verticalCenter">
                  <ButtonBoot
                    // onClick={handleCollapse}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0px',
                      paddingLeft: '10%',
                      textAlign: 'left',
                      color: 'black',
                    }}
                  >
                    {/* {downIcon} */}
                  </ButtonBoot>
                </div>
                <div className="verticalCenter">
                  <input
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                    }}
                    placeholder="Enter a task name..."
                    // value={formInput.name}
                    name="name"
                  // onChange={handleChange}
                  />
                </div>
                <div
                  className="verticalCenter"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingRight: '8%',
                  }}
                >
                  <button
                    type="button"
                    // onClick={handleDelete}
                    style={{
                      paddingBottom: '4px', color: 'black', backgroundColor: 'transparent', border: 'none',
                    }}
                  >{trashIcon}
                  </button>
                </div>
              </div>
              {/* --------------card-body------------------------ */}
              {/* <Collapse in={formInput.expanded}> */}
              <div id="whole-card">
                <div id="card-container" style={{ display: 'flex', flexDirection: 'column', padding: '2% 0%' }}>
                  <div
                    id="row2"
                    className="cardRow"
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                      <div className="verticalCenter">
                        <label htmlFor="deadline">Deadline:</label>
                      </div>
                      <div />
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20%',
                    }}
                    >
                      <input
                        className="form-control"
                        type="date"
                        // value={formInput.deadline}
                        // onChange={handleChange}
                        name="deadline"
                        id="deadline"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }}
                      />
                    </div>
                  </div>
                  <div
                    id="row3"
                    className="cardRow"
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}><div />
                      <div className="verticalCenter" style={{ whiteSpace: 'nowrap' }}>
                        <label htmlFor="budget">Start Date:</label>
                      </div>
                      <div />
                    </div>
                    <div
                      className="fullCenter"
                      style={{ paddingRight: '20%' }}
                    >
                      <input
                        id="budget"
                        className="form-control"
                        type="date"
                        // value={formInput.startDate}
                        placeholder="$$$"
                        // onChange={handleChange}
                        name="startDate"
                        style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none' }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="description-field"
                  className="fullCenter"
                  style={{
                    borderTop: '1px solid rgb(180, 180, 180)', padding: '2% 10%', display: 'flex', flexDirection: 'column',
                  }}
                >
                  <div id="text-label" className="fullCenter" style={{ marginBottom: '1%' }}>
                    <label htmlFor="description" className="form-label" style={{ textAlign: 'center' }}>
                      Description:
                    </label>
                  </div>
                  <textarea
                    className="form-control"
                    placeholder="A description of your checkpoint..."
                    id="description"
                    rows="3"
                    // value={formInput.description}
                    // onChange={handleChange}
                    name="description"
                    style={{ backgroundColor: 'rgb(225, 225, 225)', border: 'none', minWidth: '250px' }}
                  />
                </div>
              </div>
              {/* </Collapse> */}
            </div>
            {/* -----add-a-task------ */}
            <div className="marginR" />
          </div>
        </div>
        <div className="marginR" />
      </div>
      {/* ----add-a-task---- */}
      <div className="checkpoint">
        <div className="marginL" />
        <div id="middle" />
        <div className="marginR" />
        <div className="marginR" />
      </div>
    </>
  );
}
