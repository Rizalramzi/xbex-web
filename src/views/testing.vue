<template>
  <Layout>
    <div class="w-full flex flex-col gap-[40px]">
      <div class="w-full container__section">
        
        <div class="container__header__main">
          <span class="title__main">Work Orders</span>
          <p class="desc__main">Track and manage all maintenance work orders.</p>
        </div>

        <div class="flex flex-row items-center gap-[20px]">
          <div class="btn__primary">+ New Work Order</div>
          <div class="background__icon">
            <img src="/icons/unlove.svg" alt="Unlove Icon" class="w-auto h-[19px] object-center object-cover shrink-0">
          </div>
        </div>
      </div>

      <div class="w-full container__section">

        <div class="flex flex-row items-center gap-[10px]">
          <div class="search">
            <img src="/icons/search.svg" alt="Search Icon" class="w-[20px] h-auto object-center object-cover shrink-0">
            <input type="text" name="" id="" class="w-full h-full outline-none" placeholder="Search Work Order">
          </div>
  
          <div class="background__icon">
            <img src="/icons/repeat.svg" alt="Repeat Icon" class="w-[16px] h-[16px] object-center object-cover shrink-0">
          </div>
          
          <div class="background__icon">
            <img src="/icons/print.svg" alt="Print Icon" class="w-[16px] h-[16px] object-center object-cover shrink-0">
          </div>
        </div>

        <div class="bg-gray-100 hover:bg-gray-300 cursor-pointer px-[30px] py-[20px] rounded-[50px] flex flex-row items-center justify-center gap-[20px]">
          <img src="/icons/filter.svg" alt="Filter Icon" class="w-[18px] h-[11px] object-center object-cover shrink-0">
          <span class="text-[14px]">Advanced Search</span>
          <img src="/icons/arrow.svg" alt="Arrow Icon" class="w-[10px] h-auto object-center object-cover shrink-0">
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-[21px]">
      <table class="w-full table-fixed border-separate border-spacing-y-4">
        <thead>
          <tr class="text-left text-[14px]">
           <th class="max-w-[195px] bg-gray-100 px-[20px] py-[12px]">
              <div class="flex items-center justify-between w-full">
                <span class="truncate">Work ID</span>
                <div class="flex flex-col gap-0.5">
                  <img src="/icons/arrow.svg" alt="Arrow Icon" class="w-[6px] h-auto object-center object-cover shrink-0 rotate-180" />
                  <img src="/icons/arrow.svg" alt="Arrow Icon" class="w-[6px] h-auto object-center object-cover shrink-0" />
                </div>
              </div>
            </th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Work Details</th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Status</th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Progress</th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Items</th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Assigned To</th>
            <th class="max-w-[195px] truncate bg-gray-100 px-[20px] py-[12px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="7" class="h-4"></td></tr>
          <tr class="text-left text-[14px]">
            <td class="container__data font-medium">WO-2024-005</td>
            <td class="">
              <div class="flex flex-col gap-[10px]">

                <div class="background__icon__content">
                  <img src="/icons/road.svg" alt="Road Icon" class="w-[21px] h-[18px] object-center object-cover shrink-0">
                </div>

                <div class="flex flex-col gap-[5px]">
                  <div class="flex flex-row items-center justify-between">
                    <span class="text-[14px]">Grader Cat</span>
                    <p class="text-[12px]">AST-007</p>
                  </div>
                  <p class="label__secondary">Hydraulic System Leak Repair</p>
                </div>

                <div class="flex flex-wrap items-center gap-[10px]">
                  <div class="high__status">High</div>
                  <div class="unplanned__status">Unplanned</div>
                </div>
              </div>
            </td>
            
            <td class="container__data">
              <div class="inprogress__status">In Progress</div>
            </td>
          </tr>
        </tbody>
      </table>


    </div>
  </Layout>
</template>