import requests
import xmltodict
import json
from datetime import datetime

# 현재 연도와 월 가져오기
current_year = datetime.now().year
current_month = datetime.now().month

# API 호출
url = f"http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear={current_year}&solMonth={current_month:02d}&ServiceKey=${{ env.API_KEY }}"
response = requests.get(url)

if response.status_code == 200:
    # XML을 파싱하여 JSON으로 변환
    parsed_data = xmltodict.parse(response.text)
    items = parsed_data['response']['body'].get('items', {}).get('item', [])

    # 동일 날짜에 여러 공휴일 처리
    holidays = {}
    if isinstance(items, list):
        for item in items:
            date = item['locdate']
            if date not in holidays:
                holidays[date] = []
            holidays[date].append(item['dateName'])
    elif isinstance(items, dict):  # 단일 항목 처리
        date = items['locdate']
        holidays[date] = [items['dateName']]

    # JSON 파일로 저장
    filename = f"holidays_{current_year}_{current_month:02d}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(holidays, f, ensure_ascii=False, indent=4)
else:
    print(f"API 호출 실패: {response.status_code}")
