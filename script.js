const modeButtons = document.querySelectorAll('.mode-btn');
const rateButtons = document.querySelectorAll('.rate-btn');
const amountInput = document.getElementById('amount');
const customRateInput = document.getElementById('customRate');
const customRateWrap = document.getElementById('customRateWrap');
const amountLabel = document.getElementById('amountLabel');
const totalResult = document.getElementById('totalResult');
const vatResult = document.getElementById('vatResult');
const netResult = document.getElementById('netResult');
const totalHint = document.getElementById('totalHint');
const netHint = document.getElementById('netHint');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const year = document.getElementById('year');

let currentMode = 'haricten-dahil';
let currentRate = 20;

const currency = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currency.format(Number.isFinite(value) ? value : 0);
}

function getRate() {
  if (currentRate === 'custom') {
    return parseFloat(customRateInput.value) || 0;
  }
  return Number(currentRate) || 0;
}

function setMode(mode) {
  currentMode = mode;
  modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));

  if (mode === 'haricten-dahil') {
    amountLabel.textContent = 'KDV Hariç Tutar';
    totalHint.textContent = 'KDV dahil toplam';
    netHint.textContent = 'KDV hariç tutar';
  } else {
    amountLabel.textContent = 'KDV Dahil Tutar';
    totalHint.textContent = 'KDV dahil toplam';
    netHint.textContent = 'KDV hariç tutar';
  }

  calculate();
}

function setRate(rate) {
  currentRate = rate;
  rateButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.rate === String(rate)));
  customRateWrap.classList.toggle('hidden', rate !== 'custom');
  calculate();
}

function calculate() {
  const amount = parseFloat(amountInput.value) || 0;
  const rate = getRate();
  const ratio = rate / 100;

  let total = 0;
  let vat = 0;
  let net = 0;

  if (currentMode === 'haricten-dahil') {
    net = amount;
    vat = net * ratio;
    total = net + vat;
  } else {
    total = amount;
    net = ratio >= 0 ? total / (1 + ratio) : 0;
    vat = total - net;
  }

  totalResult.textContent = formatCurrency(total);
  vatResult.textContent = formatCurrency(vat);
  netResult.textContent = formatCurrency(net);
}

function resetAll() {
  amountInput.value = '';
  customRateInput.value = '';
  setRate(20);
  setMode('haricten-dahil');
  calculate();
}

modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
rateButtons.forEach(btn => btn.addEventListener('click', () => setRate(btn.dataset.rate === 'custom' ? 'custom' : Number(btn.dataset.rate))));
amountInput.addEventListener('input', calculate);
customRateInput.addEventListener('input', calculate);
calculateBtn.addEventListener('click', calculate);
resetBtn.addEventListener('click', resetAll);

year.textContent = new Date().getFullYear();
calculate();
