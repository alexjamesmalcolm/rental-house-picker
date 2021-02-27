import { useCallback, useMemo, useState } from "react";
import { Gender, Person } from "../types";
import styles from "./PersonForm.module.css";

const PersonForm = ({
  onChange,
  person,
  onCancel,
}: {
  onChange: (person: Person) => void;
  person?: Person;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(person?.name ?? "");
  const [gender, setGender] = useState<Gender | undefined>(person?.gender);
  const [twin, setTwin] = useState<number>(
    person?.howManyOthersCanShareBed.twin ?? 0
  );
  const [queen, setQueen] = useState<number>(
    person?.howManyOthersCanShareBed.queen ?? 1
  );
  const [king, setKing] = useState<number>(
    person?.howManyOthersCanShareBed.king ?? 2
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (gender) {
        onChange({
          name,
          gender,
          howManyOthersCanShareBed: { king, queen, twin },
        });
      }
    },
    [gender, king, name, onChange, queen, twin]
  );
  const isFormDirtied = useMemo<boolean>(() => {
    if (person) {
      return (
        person.name !== name ||
        person.gender !== gender ||
        person.howManyOthersCanShareBed.twin !== twin ||
        person.howManyOthersCanShareBed.queen !== queen ||
        person.howManyOthersCanShareBed.king !== king
      );
    }
    return false;
  }, [gender, king, name, person, queen, twin]);
  const handleRevert = useCallback(() => {
    if (person) {
      setName(person.name);
      setGender(person.gender);
      setTwin(person.howManyOthersCanShareBed.twin);
      setQueen(person.howManyOthersCanShareBed.queen);
      setKing(person.howManyOthersCanShareBed.king);
    }
  }, [person]);
  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <label className={styles.labelSet}>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className={styles.genderContainer}>
        Gender:
        <input
          type="radio"
          name="gender"
          value="male"
          id="male"
          onChange={() => setGender("male")}
        />
        <label htmlFor="male">Male</label>
        <input
          type="radio"
          name="gender"
          value="female"
          id="female"
          onChange={() => setGender("female")}
        />
        <label htmlFor="female">Female</label>
      </div>
      <label className={styles.labelSet}>
        <span>
          How many people is this person willing to share a twin sized bed with?
        </span>
        <input
          type="number"
          value={twin}
          onChange={(e) => setTwin(Number(e.target.value))}
          min="0"
        />
      </label>
      <label className={styles.labelSet}>
        <span>
          How many people is this person willing to share a queen sized bed
          with?
        </span>
        <input
          type="number"
          value={queen}
          onChange={(e) => setQueen(Number(e.target.value))}
          min="0"
        />
      </label>
      <label className={styles.labelSet}>
        <span>
          How many people is this person willing to share a king sized bed with?
        </span>
        <input
          type="number"
          value={king}
          onChange={(e) => setKing(Number(e.target.value))}
          min="0"
        />
      </label>
      <button onClick={onCancel} disabled={!isFormDirtied}>
        Cancel
      </button>
      {person && <button onClick={handleRevert}>Revert</button>}
      <button type="submit">Save {"&"} Finish</button>
    </form>
  );
};

export default PersonForm;
