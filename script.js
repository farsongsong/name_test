// 획수 데이터
const strokeCounts = {
    'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8, 'ㅅ': 2, 
    'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3,
    'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2, 'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4, 'ㅗ': 2, 'ㅘ': 4, 
    'ㅙ': 5, 'ㅚ': 3, 'ㅛ': 3, 'ㅜ': 2, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3, 'ㅠ': 3, 'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1
};

let s1 = 0, s2 = 0;
let nameA = '', nameB = '';

// 한 글자의 총 획수 계산
function getStrokes(char) {
    if (!char || char === '☆') return 0;
    return Hangul.disassemble(char).reduce((acc, cur) => acc + (strokeCounts[cur] || 0), 0);
}

// 피라미드 애니메이션 및 계산 실행
async function runPyramid(names, strokes, containerId, resultId) {
    const container = document.getElementById(containerId);
    const resultDiv = document.getElementById(resultId);
    container.innerHTML = '';
    
    // 글자 행 생성
    const labelRow = document.createElement('div');
    labelRow.className = 'row';
    names.forEach(n => {
        const d = document.createElement('div');
        d.className = 'node char';
        d.innerText = n;
        labelRow.appendChild(d);
    });
    container.appendChild(labelRow);

    let current = strokes;
    while (current.length >= 2) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        current.forEach(num => {
            const n = document.createElement('div');
            n.className = 'node';
            n.innerText = num;
            rowDiv.appendChild(n);
        });
        container.appendChild(rowDiv);
        
        // 시각적 효과를 위한 딜레이
        await new Promise(r => setTimeout(r, 400));
        
        if (current.length === 2) break;
        current = current.slice(0, -1).map((val, i) => (val + current[i+1]) % 10);
    }

    const score = current.join('');
    resultDiv.innerText = score + '%';
    resultDiv.classList.add('show');
    return parseInt(score);
}

// 테스트 시작 (첫 번째 사람 기준)
async function startLoveTest() {
    nameA = document.getElementById('name1').value.trim();
    nameB = document.getElementById('name2').value.trim();
    
    if (!nameA || !nameB) return alert("두 이름을 모두 입력해주세요!");

    document.getElementById('inputView').style.display = 'none';
    document.getElementById('section1').classList.add('active');
    document.getElementById('n1-title').innerText = nameA;

    let combined = [], strokes = [];
    const max = Math.max(nameA.length, nameB.length);
    for(let i=0; i<max; i++) {
        const c1 = nameA[i] || '☆', c2 = nameB[i] || '☆';
        combined.push(c1, c2);
        strokes.push(getStrokes(c1), getStrokes(c2));
    }
    s1 = await runPyramid(combined, strokes, 'pyramid1', 'result1');
}

// 두 번째 섹션으로 이동 (두 번째 사람 기준)
async function goToSection2() {
    document.getElementById('section1').classList.remove('active');
    document.getElementById('section2').classList.add('active');
    document.getElementById('n2-title').innerText = nameB;

    let combined = [], strokes = [];
    const max = Math.max(nameA.length, nameB.length);
    for(let i=0; i<max; i++) {
        const c1 = nameA[i] || '☆', c2 = nameB[i] || '☆';
        combined.push(c2, c1); // 순서 반전
        strokes.push(getStrokes(c2), getStrokes(c1));
    }
    s2 = await runPyramid(combined, strokes, 'pyramid2', 'result2');
}

// 최종 결과 계산 및 출력
function goToFinalResult() {
    document.getElementById('section2').classList.remove('active');
    document.getElementById('section3').classList.add('active');
    
    const final = Math.round((s1 + s2) / 2);
    document.getElementById('finalScore').innerText = final + '%';
    document.getElementById('c-name1').innerText = nameA + ' 우선';
    document.getElementById('c-name2').innerText = nameB + ' 우선';
    document.getElementById('compare1').innerText = s1 + '%';
    document.getElementById('compare2').innerText = s2 + '%';
}