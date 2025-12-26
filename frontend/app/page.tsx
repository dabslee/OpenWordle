import Text from "./components/Text";
import Container from './components/Container/Container';
import LetterField from "./components/LetterField/LetterField";

export default function HomePage() {
  return (
      <div className={"flex justify-center bg-blue"} style={{flex: 1, width: "100%"}}>
        <Container>
          <Text className={'text-headline-h1'}>Wordle</Text>
          <LetterField state="contained"/>
          <LetterField state="correct"/>
          <LetterField state="default"/>
        </Container>
      </div>
  );
}
