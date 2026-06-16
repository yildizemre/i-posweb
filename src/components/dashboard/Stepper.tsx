import styles from './Stepper.module.css'

interface StepperProps {
  steps: string[]
  current: number
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className={styles.stepper}>
      {steps.map((label, i) => (
        <div key={label} className={styles.step}>
          <div className={`${styles.dot} ${i <= current ? styles.dotActive : ''}`} />
          {i < steps.length - 1 && <div className={`${styles.line} ${i < current ? styles.lineActive : ''}`} />}
          <span className={`${styles.label} ${i <= current ? styles.labelActive : ''}`}>{label}</span>
        </div>
      ))}
    </div>
  )
}
