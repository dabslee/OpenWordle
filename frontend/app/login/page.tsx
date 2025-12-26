"use client";
import React, {useState} from 'react'
import Container from '../components/Container/Container'
import Text from '../components/Text'
import Field from '../components/Field/Field'
import Button from '../components/Button/Button';

const login = () => {
  const [user, setUser] = useState<string>("")
  const [pass, setPass] = useState<string>("")
  return (
    <div className={"flex justify-center align-center bg-peach"} style={{flex: 1, width: "100%"}}>
      <Container style={{width: "582px"}}>
        <div className={"col gap-lg align-center bg-primary br-lg pad-xxxl"} style={{width: "100%"}}>
          <Text className={'text-headline-h1'}>Login</Text>
          <div className={"col gap-xxl align-center"} style={{width: "100%"}}>
            <div className={"col gap-md"} style={{width: "100%"}}>
              <Field 
                value={user}
                placeholder={"Username"}
                onChange={setUser}
                variant={"outline"}
              />
              <Field 
                value={pass}
                placeholder={"Password"}
                onChange={setPass}
                variant={"outline"}
              />
            </div>
            <div className={"col gap-md"} style={{width: "100%"}}>
              <Button 
                text="Login"
                size="large"
                showDropShadow={false}
              />
              <Button 
                text="Register"
                size="large"
                showDropShadow={false}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default login