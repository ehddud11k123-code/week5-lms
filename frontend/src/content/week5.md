# Week 5: 딥러닝 성능 향상 기법

## 섹션 1: 규제 기법 (Regularization)

딥러닝 모델이 훈련 데이터에 과도하게 적응하는 **과적합(Overfitting)**을 방지하는 기법들입니다.

### L1 / L2 정규화

- **L1 (Lasso)**: 가중치를 0으로 만들어 희소한 모델 생성
- **L2 (Ridge)**: 가중치를 작게 유지, 가장 일반적으로 사용

```python
from tensorflow.keras.regularizers import l2

model.add(Dense(64, activation='relu', kernel_regularizer=l2(0.01)))
```

### Dropout

학습 중 임의의 뉴런을 비활성화해 과적합 방지:

```python
from tensorflow.keras.layers import Dropout

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))  # 50% 뉴런 무작위 비활성화
```

### Batch Normalization

각 레이어의 입력을 정규화해 학습을 안정화:

```python
from tensorflow.keras.layers import BatchNormalization

model.add(Dense(128))
model.add(BatchNormalization())
model.add(Activation('relu'))
```

---

## 섹션 2: 적절한 모델 복잡도

| 상태 | 증상 | 해결 방법 |
|------|------|-----------|
| 과소적합 | 훈련/검증 모두 낮은 정확도 | 모델 복잡도 증가 |
| 과적합 | 훈련 정확도↑ 검증 정확도↓ | 규제 기법 적용 |
| 균형 | 훈련/검증 모두 높은 정확도 | 현재 상태 유지 |

---

## 섹션 3: 데이터 증강 (Data Augmentation)

제한된 데이터셋의 다양성을 인위적으로 확대하는 기법:

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
)
datagen.fit(X_train)
```

---

## 섹션 4: 전이 학습 (Transfer Learning)

대규모 데이터셋으로 사전 학습된 모델을 활용해 적은 데이터로도 높은 성능 달성:

```python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, Model

base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # 사전 학습 가중치 동결

x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(128, activation='relu')(x)
output = layers.Dense(10, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)
```

---

## 섹션 5: CNN 실습 — MNIST 손글씨 인식

합성곱 신경망으로 손글씨 숫자 분류:

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax'),
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=10, validation_split=0.2)
```
